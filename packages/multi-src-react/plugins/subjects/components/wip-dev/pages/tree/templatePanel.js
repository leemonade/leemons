import { Select, Button, InlineSvg } from 'leemons-ui';

export default function TemplatePanel() {
  return (
    <aside className="flex flex-col gap-2">
      <div className="relative h-10 w-10">
        <InlineSvg src="/subjects/template_icon.svg" className="text-primary-400" />
      </div>
      <h2 className="font-inter font-normal">
        Do you want to use a predefined subject template and save time?
      </h2>
      <p className="font-inter text-sm text-gray-300">
        Choose the type of template for the courses you teach according to the country of your
        school, customize it and load it into the system.
      </p>
      <div className="flex flex-col py-4 gap-2">
        <Select
          outlined={true}
          multiple={false}
          className="w-full max-w-sm"
          defaultValue="placeholder"
        >
          <option value="placeholder">Spain</option>
          <option value="TELECO">telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
        <Select outlined={true} className="w-full max-w-sm" defaultValue="placeholder">
          <option value="placeholder">Select template</option>
          <option value="TELECO">telekinesis</option>
          <option>time travel</option>
          <option>invisibility</option>
        </Select>
      </div>
      <Button disabled={true} rounded={true} color="primary">
        Preview template
      </Button>
    </aside>
  );
}
