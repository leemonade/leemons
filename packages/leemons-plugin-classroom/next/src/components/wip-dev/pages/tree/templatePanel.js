// TODO: Do not show again

import { Select, Button } from 'leemons-ui';

export default function TemplatePanel() {
  return (
    <div className="flex-1 m2">
      <aside className="help-wizard">
        {/* TO DO LIBRERIA ICONOS PROPIA - No existe similar a este en HeroIcons */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="help-wizard_ico"
        >
          <g clipPath="url(#clip0)">
            <path
              d="M0.75 0.747986H5.25V5.24799H0.75V0.747986Z"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M0.75 18.748H5.25V23.248H0.75V18.748Z"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.25 0.747986H21.75V5.24799H17.25V0.747986Z"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.25 18.748H21.75V23.248H17.25V18.748Z"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.25 2.24799H17.25"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.25 5.24799V18.748"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.25 21.748H5.25"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.25 18.748V5.24799"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.75 8.99999C6.74974 8.70434 6.80774 8.41155 6.9207 8.13833C7.03365 7.86512 7.19935 7.61685 7.4083 7.4077C7.61726 7.19856 7.86539 7.03265 8.1385 6.91945C8.41161 6.80625 8.70436 6.74799 9 6.74799H13.5C13.7956 6.74799 14.0884 6.80625 14.3615 6.91945C14.6346 7.03265 14.8827 7.19856 15.0917 7.4077C15.3007 7.61685 15.4663 7.86512 15.5793 8.13833C15.6923 8.41155 15.7503 8.70434 15.75 8.99999"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.25 6.74799V17.248"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.21899 17.248H14.219"
              stroke="#5B6577"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="32" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <h2 className="help-wizard_name">Do you want to pre-load a template to save time?</h2>
        <p className="help-wizard_description">
          Choose the type of template and click on load tree, later you can modify the dataset of
          each level according to the needs of your organisation.
        </p>
        <Select outlined={true} multiple={false} className="w-full max-w-xs">
          <option disabled={false} selected={true}>
            Spain
          </option>
          <option value="TELECO">telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
        <Select outlined={true} className="w-full max-w-xs text-secondary-300">
          <option value="placeholder">Select template</option>
          <option value="TELECO">telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
        <Button disabled={true} rounded={true} color="primary">
          Preview template
        </Button>
        <div className="help-wizard_legend">
          I prefer to do it manually
          <Button color="primary" link className=" btn-link">
            Do not show any more.
          </Button>
        </div>
      </aside>
    </div>
  );
}
