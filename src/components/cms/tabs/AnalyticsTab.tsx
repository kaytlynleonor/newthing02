import React from 'react';
import { Package } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

export function AnalyticsTab() {
  const { products } = useStore();
  const sorted = [...products].sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-lg uppercase tracking-[0.2em]">Product Analytics</h2>
      <div className="border border-[#EEE8DF] overflow-x-auto">
        <table className="w-full min-w-[600px] text-xs font-sans">
          <thead>
            <tr className="border-b-2 border-[#EEE8DF] bg-[#F5F1EB] text-[#A99684]">
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Views</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((product) => (
              <tr key={product.id} className="border-b border-[#EEE8DF]">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-8 shrink-0 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-8 shrink-0 items-center justify-center bg-[#EEE8DF]">
                        <Package size={12} className="text-[#A99684]" />
                      </div>
                    )}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="p-3">{product.sku}</td>
                <td className="p-3">{product.viewCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
