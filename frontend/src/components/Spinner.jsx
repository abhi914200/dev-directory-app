const Spinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mb-3" />
      <p className="text-sm text-slate-600">{text}</p>
    </div>
  );
};

export default Spinner;
