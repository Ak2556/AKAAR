import { useState, useCallback } from "react";

export interface ModelAnalysis {
  volume: number;
  surfaceArea: number;
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
    dimensions: [number, number, number];
  };
  triangleCount: number;
  isWatertight: boolean;
  estimatedPrintTime: number;
  estimatedMaterial: number;
  estimatedPrice: number;
  currency: string;
}

export interface ModelValidation {
  valid: boolean;
  issues: string[];
  triangleCount: number;
  isWatertight: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function requireApiUrl(): string {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not set");
  }
  return API_URL;
}

export function useGeometry() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ModelAnalysis | null>(null);
  const [validation, setValidation] = useState<ModelValidation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeModel = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${requireApiUrl()}/geometry/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to analyze model");
      }

      const data = await response.json();
      setAnalysis(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const validateModel = useCallback(async (file: File) => {
    setError(null);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${requireApiUrl()}/geometry/validate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to validate model");
      }

      const data = await response.json();
      setValidation(data);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, []);

  const resetGeometry = useCallback(() => {
    setAnalysis(null);
    setValidation(null);
    setError(null);
  }, []);

  return {
    analyzeModel,
    validateModel,
    resetGeometry,
    isAnalyzing,
    analysis,
    validation,
    error,
  };
}
