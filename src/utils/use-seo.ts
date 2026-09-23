import { useEffect } from "react";
import { updateSEO, type SEOData, seoData } from "./seo";

const useSEO = (seoData: SEOData) => {
  useEffect(() => {
    updateSEO(seoData);
  }, [seoData]);
};

export const usePageSEO = (pageKey: keyof typeof seoData) => {
  useSEO(seoData[pageKey]);
};
