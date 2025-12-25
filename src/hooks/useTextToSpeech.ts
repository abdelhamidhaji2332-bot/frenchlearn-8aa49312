import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PronunciationData {
  french: string;
  ipa: string;
  syllables: string;
  tips: string;
}

export const useTextToSpeech = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pronunciationData, setPronunciationData] = useState<PronunciationData | null>(null);

  // Use browser's built-in speech synthesis for actual audio
  const speak = useCallback((text: string, lang: string = 'fr-FR') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9; // Slightly slower for learning
      utterance.pitch = 1;
      
      // Try to find a French voice
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') || voice.name.toLowerCase().includes('french')
      );
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error('Speech synthesis not supported in this browser');
    }
  }, []);

  // Get AI pronunciation guide
  const getPronunciationGuide = useCallback(async (text: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text }
      });

      if (error) throw error;
      
      setPronunciationData(data);
      return data;
    } catch (err) {
      console.error('Pronunciation guide error:', err);
      toast.error('Failed to get pronunciation guide');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Speak with pronunciation guide
  const speakWithGuide = useCallback(async (text: string) => {
    speak(text);
    await getPronunciationGuide(text);
  }, [speak, getPronunciationGuide]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    speakWithGuide,
    stopSpeaking,
    getPronunciationGuide,
    isLoading,
    isSpeaking,
    pronunciationData,
  };
};
