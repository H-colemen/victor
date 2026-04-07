import { useEffect, useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { getAllSiteSettings, updateSiteSetting } from '@/services/adminService';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [originalSettings, setOriginalSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    const data = await getAllSiteSettings();
    const settingsMap: Record<string, string> = {};
    data.forEach(s => {
      settingsMap[s.setting_key] = s.setting_value || '';
    });
    setSettings(settingsMap);
    setOriginalSettings(settingsMap);
    setIsLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    const changedKeys = Object.keys(settings).filter(
      key => settings[key] !== originalSettings[key]
    );

    for (const key of changedKeys) {
      await updateSiteSetting(key, settings[key]);
    }

    setOriginalSettings(settings);
    setSaveMessage('Settings saved successfully!');
    setIsSaving(false);

    setTimeout(() => setSaveMessage(''), 3000);
  };

  const hasChanges = Object.keys(settings).some(
    key => settings[key] !== originalSettings[key]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#005EE9] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[#0F172A]">Site Settings</h1>
          <p className="text-gray-500">Configure your website settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 bg-[#005EE9] text-white px-4 py-2 rounded-lg hover:bg-[#0F172A] transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      {saveMessage && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg">
          {saveMessage}
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Site Info */}
        <div>
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Site Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Site Name</label>
              <input
                type="text"
                value={settings.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Site Tagline</label>
              <input
                type="text"
                value={settings.site_tagline || ''}
                onChange={(e) => handleChange('site_tagline', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Contact Email</label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                placeholder="27835829819"
              />
            </div>
          </div>
        </div>

        {/* Currency & Pricing */}
        <div>
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Currency & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Currency Code</label>
              <input
                type="text"
                value={settings.currency || ''}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                placeholder="ZAR"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency_symbol || ''}
                onChange={(e) => handleChange('currency_symbol', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
                placeholder="R"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Free Shipping Threshold (R)</label>
              <input
                type="number"
                value={settings.free_shipping_threshold || ''}
                onChange={(e) => handleChange('free_shipping_threshold', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.facebook_url || ''}
                onChange={(e) => handleChange('facebook_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div>
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">Footer</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Footer Description</label>
            <textarea
              value={settings.footer_description || ''}
              onChange={(e) => handleChange('footer_description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#005EE9] resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
