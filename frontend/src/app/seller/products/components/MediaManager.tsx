"use client";

import React, { useState } from 'react';
import { Plus, X, Image as ImageIcon, Video, Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  is_hero: boolean;
  file?: File;
}

interface MediaManagerProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ media, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMedia: MediaItem[] = files.map(file => {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      return {
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        type: type as 'image' | 'video',
        is_hero: false,
        file: file
      };
    });

    // Validation: Max 1 video
    const existingVideo = media.find(m => m.type === 'video');
    const incomingVideos = newMedia.filter(m => m.type === 'video');

    let filteredNewMedia = newMedia;
    if (existingVideo || incomingVideos.length > 1) {
      alert("Only 1 Video is allowed per product node.");
      filteredNewMedia = newMedia.filter(m => m.type !== 'video');
    }

    const updatedMedia = [...media, ...filteredNewMedia];

    // Auto-set hero if none exists and we have an image
    if (!updatedMedia.find(m => m.is_hero) && updatedMedia.find(m => m.type === 'image')) {
      const firstImage = updatedMedia.find(m => m.type === 'image');
      if (firstImage) firstImage.is_hero = true;
    }

    onChange(updatedMedia);
  };

  const removeMedia = (id: string) => {
    const itemToRemove = media.find(m => m.id === id);
    const updatedMedia = media.filter(m => m.id !== id);

    // If we removed the hero, pick a new one
    if (itemToRemove?.is_hero && updatedMedia.length > 0) {
      const nextImage = updatedMedia.find(m => m.type === 'image');
      if (nextImage) nextImage.is_hero = true;
    }

    onChange(updatedMedia);
  };

  const setHero = (id: string) => {
    const updatedMedia = media.map(m => ({
      ...m,
      is_hero: m.id === id && m.type === 'image'
    }));
    onChange(updatedMedia);
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Product Media (Images & 1 Video)</label>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AnimatePresence>
          {media.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group relative aspect-square rounded-3xl overflow-hidden border border-gray-100 bg-gray-50"
            >
              {item.type === 'image' ? (
                <img src={item.url} alt="Product" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4">
                  <Video className="w-8 h-8 mb-2" />
                  <span className="text-[8px] font-black uppercase tracking-tighter">Video Node</span>
                </div>
              )}

              {/* Overlay Actions - Compact & High Contrast */}
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-2">
                {item.type === 'image' && (
                  <button 
                    type="button"
                    onClick={() => setHero(item.id)}
                    className={cn(
                      "p-2 rounded-xl transition-all shadow-lg border border-white/20",
                      item.is_hero ? "bg-yellow-400 text-black scale-110" : "bg-white text-black hover:bg-gray-100"
                    )}
                  >
                    <Star className={cn("w-4 h-4", item.is_hero && "fill-current")} />
                  </button>
                )}
                <button 
                  type="button"
                  onClick={() => removeMedia(item.id)}
                  className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg border border-white/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Badges */}
              {item.is_hero && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[8px] font-black px-2 py-1 rounded-lg shadow-xl shadow-black/20 uppercase">
                  Hero
                </div>
              )}
              {item.type === 'video' && (
                <div className="absolute top-2 left-2 bg-purple-500 text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-xl shadow-black/20 uppercase">
                  Video
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Upload Button */}
        <div className="relative aspect-square rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-black/20 hover:bg-gray-50 transition-all cursor-pointer group">
          <Plus className="w-8 h-8 text-gray-300 group-hover:text-black transition-colors" />
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center px-4">Upload Asset</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
