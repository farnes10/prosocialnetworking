
import { Plus, X } from 'lucide-react';
import { FieldError } from 'react-hook-form';

interface RequirementsListProps {
  requirements: string[];
  onChange: (requirements: string[]) => void;
  error?: FieldError;
}

export function RequirementsList({ requirements, onChange, error }: RequirementsListProps) {
  const addRequirement = () => {
    onChange([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    onChange(requirements.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    onChange(newRequirements);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Requirements</label>
        <button
          type="button"
          onClick={addRequirement}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Requirement
        </button>
      </div>
      {requirements.map((requirement, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={requirement}
            onChange={(e) => updateRequirement(index, e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={() => removeRequirement(index)}
            className="inline-flex items-center p-2 border border-transparent rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
}