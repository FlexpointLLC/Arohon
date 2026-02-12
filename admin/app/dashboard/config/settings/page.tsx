import { AllSettingsEditor } from "../all-settings-editor";

export default function ConfigSettingsPage() {
  return (
    <div className="card p-6">
      <h2 className="font-semibold text-white">System settings</h2>
      <p className="mt-1 text-sm text-slate-400">
        View and edit every system setting. Add new keys as needed.
      </p>
      <div className="mt-4">
        <AllSettingsEditor />
      </div>
    </div>
  );
}
