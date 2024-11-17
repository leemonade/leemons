import { useForm } from 'react-hook-form';
import { PropTypes } from 'prop-types';

export default function OnboarderFormAmazonSes({ onSubmit, onTest }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div>
          <div>
            <label>Nombre</label>
          </div>
          <input
            className="border border-gray-500 rounded"
            defaultValue="Amazon Leemons"
            {...register('name', { required: true })}
          />
          {errors.name && <span>name is required</span>}
        </div>

        <div>
          <div>
            <label>Region</label>
          </div>
          <input
            className="border border-gray-500 rounded"
            defaultValue="eu-central-1"
            {...register('region', { required: true })}
          />
          {errors.region && <span>region is required</span>}
        </div>
        <div>
          <div>
            <label>Access Key</label>
          </div>
          <input
            className="border border-gray-500 rounded"
            defaultValue=""
            {...register('accessKey', { required: true })}
          />
          {errors.accessKey && <span>accessKey is required</span>}
        </div>
        <div>
          <div>
            <label>Secret Access Key</label>
          </div>
          <input
            className="border border-gray-500 rounded"
            defaultValue=""
            {...register('secretAccessKey', { required: true })}
          />
          {errors.secretAccessKey && <span>secretAccessKey is required</span>}
        </div>
        <button type="button" onClick={handleSubmit(onTest)}>
          Test
        </button>
        <button type="button" onClick={handleSubmit(onSubmit)}>
          Guardar
        </button>
      </form>
    </>
  );
}
OnboarderFormAmazonSes.propTypes = {
  onSubmit: PropTypes.func,
  onTest: PropTypes.func,
};
