import { useEffect, useState } from 'react';
import { Plus, Eye, EyeOff, Trash2, Upload } from 'lucide-react';
import { getAllHeroSlides, createHeroSlide, updateHeroSlide, deleteHeroSlide } from '@/services/adminService';
import type { HeroSlide } from '@/lib/supabase';

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: 'Shop Now',
    button_link: '/shop',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setIsLoading(true);
    const data = await getAllHeroSlides();
    setSlides(data);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('slide-image') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (editingSlide) {
      await updateHeroSlide(editingSlide.id, { ...formData }, file || undefined);
    } else {
      if (!file) {
        alert('Please select an image');
        return;
      }
      await createHeroSlide(formData, file);
    }

    setIsModalOpen(false);
    setEditingSlide(null);
    resetForm();
    loadSlides();
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      button_text: slide.button_text,
      button_link: slide.button_link,
      is_active: slide.is_active,
      sort_order: slide.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      await deleteHeroSlide(id);
      loadSlides();
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    await updateHeroSlide(slide.id, { is_active: !slide.is_active });
    loadSlides();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      button_text: 'Shop Now',
      button_link: '/shop',
      is_active: true,
      sort_order: slides.length,
    });
  };

  const openAddModal = () => {
    setEditingSlide(null);
    resetForm();
    setIsModalOpen(true);
  };

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
          <h1 className="text-2xl font-serif text-[#0F172A]">Hero Slides</h1>
          <p className="text-gray-500">Manage homepage slideshow images</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#005EE9] text-white px-4 py-2 rounded-lg hover:bg-[#0F172A] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </button>
      </div>

      {/* Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.map((slide, index) => (
          <div key={slide.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={slide.image_url}
                alt={slide.title || 'Hero slide'}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleToggleActive(slide)}
                  className={`p-2 rounded-lg ${slide.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}
                  title={slide.is_active ? 'Active' : 'Inactive'}
                >
                  {slide.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleEdit(slide)}
                  className="p-2 bg-white rounded-lg hover:bg-gray-100"
                  title="Edit"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="p-2 bg-white rounded-lg hover:bg-red-100 text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                #{index + 1}
              </div>
            </div>
            <div className="p-4">
              {slide.title && <p className="font-medium">{slide.title}</p>}
              {slide.subtitle && <p className="text-sm text-gray-500">{slide.subtitle}</p>}
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Button: {slide.button_text}</span>
                <span>→</span>
                <span>{slide.button_link}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No slides yet</h3>
          <p className="text-gray-500 mb-4">Add hero slides to showcase on your homepage</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#005EE9] text-white px-4 py-2 rounded-lg hover:bg-[#0F172A] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add First Slide
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-medium">
                {editingSlide ? 'Edit Slide' : 'Add New Slide'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  {editingSlide ? 'Change Image (optional)' : 'Image *'}
                </label>
                <input
                  type="file"
                  id="slide-image"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                {editingSlide && (
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-1">Title (optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., Summer Sale"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., Up to 50% off"
                />
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-sm font-medium mb-1">Button Text</label>
                <input
                  type="text"
                  value={formData.button_text}
                  onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="Shop Now"
                />
              </div>

              {/* Button Link */}
              <div>
                <label className="block text-sm font-medium mb-1">Button Link</label>
                <input
                  type="text"
                  value={formData.button_link}
                  onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="/shop"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  min="0"
                />
              </div>

              {/* Active */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 text-[#005EE9] rounded"
                />
                <span className="text-sm">Active</span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSlide(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#005EE9] text-white rounded-lg hover:bg-[#0F172A]"
                >
                  {editingSlide ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
