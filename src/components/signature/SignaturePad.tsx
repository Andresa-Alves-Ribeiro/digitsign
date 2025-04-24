'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { motion } from 'framer-motion';
import { SignaturePadProps } from '@/types/interfaces/signature';

const SignaturePad = ({ onSave: _onSave, onCancel: _onCancel }: SignaturePadProps) => {
  const signaturePadRef = useRef<SignatureCanvas>(null);

  const clear = useCallback(() => {
    if (signaturePadRef.current) {
      try {
        signaturePadRef.current.clear();
        const canvas = signaturePadRef.current.getCanvas();
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      } catch (error) {
        console.error('Error clearing signature pad from component:', error);
      }
    }
  }, []);

  const isEmpty = useCallback(() => {
    try {
      return signaturePadRef.current?.isEmpty() ?? true;
    } catch (error) {
      console.error('Error checking if signature pad is empty:', error);
      return true;
    }
  }, []);

  const toDataURL = useCallback(() => {
    try {
      return signaturePadRef.current?.toDataURL() ?? '';
    } catch (error) {
      console.error('Error getting signature data URL:', error);
      return '';
    }
  }, []);

  useEffect(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-expect-error - Adding methods to window object for external access
      window.signaturePadMethods = {
        clear,
        isEmpty,
        toDataURL
      };
    }
  }, [clear, isEmpty, toDataURL]);

  return (
    <motion.div 
      className="flex flex-col w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full border border-gray-200 rounded-lg mb-6 overflow-hidden bg-neutral-50">
        <SignatureCanvas
          ref={signaturePadRef}
          canvasProps={{
            className: 'w-full h-48 md:h-56',
            'aria-label': 'Área para assinatura'
          }}
          backgroundColor="rgb(250, 250, 250)"
          clearOnResize={true}
        />
      </div>
    </motion.div>
  );
};

export default SignaturePad;