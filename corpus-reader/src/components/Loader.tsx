const Loader = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-foreground border-opacity-50"></div>
      <p className="mt-4 text-lg font-medium">{text}</p>
    </div>
  );
};


export default Loader;