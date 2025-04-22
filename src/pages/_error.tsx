import { NextPageContext } from 'next';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { ErrorLayout } from '@/components/ErrorLayout';

interface ErrorProps {
  statusCode?: number;
}

function Error({ statusCode }: ErrorProps) {
  const errorMessage = statusCode
    ? `Ocorreu um erro ${statusCode} no servidor`
    : 'Ocorreu um erro no cliente';

  return (
    <ErrorLayout>
      <ErrorDisplay
        error={errorMessage}
        onRetry={() => {
          window.location.href = '/';
        }}
      />
    </ErrorLayout>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 