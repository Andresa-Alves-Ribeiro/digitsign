interface LoadingProps {
  text?: string;
}

const Loading = ({ text = 'Carregando...' }: LoadingProps) => {
  return (
    <output className="flex flex-col items-center justify-center min-h-[150px] sm:min-h-[200px]">
      <div 
        data-testid="loading-animation" 
        className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-green-600"
        aria-hidden="true"
      />
      <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base text-gray-600">{text}</p>
    </output>
  );
};

export default Loading; 