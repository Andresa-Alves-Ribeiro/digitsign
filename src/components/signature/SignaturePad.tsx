'use client';

import React, { useRef, useCallback, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { motion } from 'framer-motion';
import { SignaturePadProps } from '@/types/interfaces/signature';
import { useTheme } from '@/contexts/ThemeContext';

const SignaturePad = ({ onSave: _onSave, onCancel: _onCancel }: SignaturePadProps) => {
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const previousThemeRef = useRef(theme);
  const signatureDataRef = useRef<string>('');

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

  const redrawSignature = useCallback((imageData: string) => {
    if (!signaturePadRef.current || !imageData) return;

    const canvas = signaturePadRef.current.getCanvas();
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
  }, []);

  // Only clear on initial mount
  useEffect(() => {
    clear();
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (previousThemeRef.current !== theme) {
      previousThemeRef.current = theme;
      
      if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
        // Save current signature
        const currentSignature = signaturePadRef.current.toDataURL();
        signatureDataRef.current = currentSignature;
        
        // Clear and redraw with new color
        clear();
        redrawSignature(currentSignature);
      }
    }
  }, [theme, clear, redrawSignature]);

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
      <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg mb-6 overflow-hidden bg-white dark:bg-gray-800">
        <SignatureCanvas
          ref={signaturePadRef}
          canvasProps={{
            className: 'w-full h-48 md:h-56',
            'aria-label': 'Área para assinatura'
          }}
          backgroundColor="rgb(255, 255, 255)"
          penColor="rgb(59, 130, 246)"
          clearOnResize={false}
        />
      </div>
    </motion.div>
  );
};

export default SignaturePad;