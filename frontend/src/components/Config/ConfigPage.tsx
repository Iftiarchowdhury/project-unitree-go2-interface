import { useState } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ConfigSection {
  title: string;
  description: string;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'number' | 'switch' | 'select';
    options?: string[];
    value: any;
  }[];
}

export const ConfigPage = () => {
  const [configSections, setConfigSections] = useState<ConfigSection[]>([
    {
      title: 'Robot Settings',
      description: 'Configure basic robot parameters',
      fields: [
        {
          key: 'maxSpeed',
          label: 'Maximum Speed (m/s)',
          type: 'number',
          value: 2.5
        },
        {
          key: 'operationMode',
          label: 'Operation Mode',
          type: 'select',
          options: ['Manual', 'Autonomous', 'Hybrid'],
          value: 'Manual'
        }
      ]
    },
    {
      title: 'Safety Settings',
      description: 'Configure safety parameters',
      fields: [
        {
          key: 'emergencyStop',
          label: 'Emergency Stop Enabled',
          type: 'switch',
          value: true
        },
        {
          key: 'obstacleDistance',
          label: 'Minimum Obstacle Distance (m)',
          type: 'number',
          value: 0.5
        }
      ]
    }
  ]);

  const handleFieldChange = (sectionIndex: number, fieldIndex: number, value: any) => {
    const newSections = [...configSections];
    newSections[sectionIndex].fields[fieldIndex].value = value;
    setConfigSections(newSections);
  };

  const handleSave = async () => {
    try {
      // Here you would typically save to your backend
      toast.success('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save configuration');
    }
  };

  const handleReset = () => {
    // Here you would typically reset to default values
    toast.success('Configuration reset to defaults');
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold">System Configuration</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset to Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {configSections.map((section, sectionIndex) => (
          <div key={section.title} className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-400 mb-6">{section.description}</p>
            
            <div className="space-y-4">
              {section.fields.map((field, fieldIndex) => (
                <div key={field.key} className="flex items-center justify-between">
                  <label className="flex-1">{field.label}</label>
                  <div className="w-64">
                    {field.type === 'switch' ? (
                      <button
                        onClick={() => handleFieldChange(sectionIndex, fieldIndex, !field.value)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          field.value ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            field.value ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : field.type === 'select' ? (
                      <select
                        value={field.value}
                        onChange={(e) => handleFieldChange(sectionIndex, fieldIndex, e.target.value)}
                        className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {field.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => handleFieldChange(
                          sectionIndex,
                          fieldIndex,
                          field.type === 'number' ? parseFloat(e.target.value) : e.target.value
                        )}
                        className="w-full bg-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 