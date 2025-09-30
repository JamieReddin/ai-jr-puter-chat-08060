import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Declare puter as a global variable
declare global {
  interface Window {
    puter: any;
  }
}

interface VoiceMicrophoneProps {
  onTranscript: (text: string) => void;
  isLoading: boolean;
}

export function VoiceMicrophone({ onTranscript, isLoading }: VoiceMicrophoneProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const recordingRef = useRef<boolean>(false);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
      recordingRef.current = true;
      
      toast({
        title: "Recording started",
        description: "Speak now. Click the microphone again to stop.",
      });
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      recordingRef.current = false;
      setMediaRecorder(null);
      
      toast({
        title: "Recording stopped",
        description: "Processing your voice input...",
      });
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      // Convert blob to ArrayBuffer then to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      const chunkSize = 32768;
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      
      const base64Audio = btoa(binary);
      
      try {
        // Use Puter's AI for speech recognition
        // Note: We'll need to implement proper speech-to-text when API is available
        // For now, simulate transcription
        const mockTranscription = "Hello, this is a test transcription. Speech-to-text is not yet fully implemented with Puter AI.";
        
        setTimeout(() => {
          onTranscript(mockTranscription);
          toast({
            title: "Voice processed",
            description: "Your message has been transcribed (demo mode).",
          });
        }, 1000);
        
      } catch (error) {
        console.error('Error transcribing audio:', error);
        toast({
          title: "Transcription failed",
          description: "Could not process your voice input. Please try typing instead.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Audio processing failed",
        description: "Could not process your voice input.",
        variant: "destructive",
      });
    }
  };

  const handleMicClick = () => {
    if (isLoading) return;
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder && recordingRef.current) {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleMicClick}
      disabled={isLoading}
      className={`h-9 w-9 ${isRecording ? 'text-red-500 animate-pulse' : 'text-muted-foreground hover:text-foreground'}`}
      title={isRecording ? "Stop recording" : "Start voice input"}
    >
      {isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}