// ...existing code...
import { ZodError } from 'zod';

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    // prepare object matching your Zod schemas (they expect { body, query, params })
    const toValidate = {
      body: req.body,
      query: req.query,
      params: req.params
    };

    // parse/validate
    const parsed = await schema.parseAsync(toValidate);

    // don't overwrite req.query (may be read-only) — attach validated data here
    req.validated = {
      body: parsed.body ?? {},
      query: parsed.query ?? {},
      params: parsed.params ?? {}
    };

    // it's safe to replace req.body so controllers that expect validated body keep working
    if (parsed.body) req.body = parsed.body;

    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({ message: 'Validation error', issues: err.errors });
    }
    console.error('Validation middleware error:', err);
    return res.status(500).json({ message: 'Server validation error' });
  }
};
// ...existing code...