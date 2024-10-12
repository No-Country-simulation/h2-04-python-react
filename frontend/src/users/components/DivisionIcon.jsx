/* eslint-disable react/prop-types */
import { locked } from "@/common/assets"
import { Check } from 'lucide-react';

  const DivisionIcon = ({ src, alt, status }) => {
    
  return (
    <div className="relative">
      <img src={src} alt={alt} className={`w-[60px] ${status === 'completed' ? 'opacity-50' : 'opacity-100'}`} />
      {status === 'locked' && (
        <div className="absolute inset-0 flex items-center justify-center">
        <img src={locked} alt="" className="w-7" />
      </div>
      )}
      {status === 'completed' && (
        <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
          <Check className="text-white" size={16} />
        </div>
      )}
    </div>
  )
}

export default DivisionIcon