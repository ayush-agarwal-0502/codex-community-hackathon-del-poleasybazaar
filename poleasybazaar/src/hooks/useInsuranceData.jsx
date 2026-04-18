import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Fuse from "fuse.js";
import Papa from "papaparse";
import productsCsvUrl from "../data/insurance_products.csv?url";
import faqsCsvUrl from "../data/insurance_faqs.csv?url";

const InsuranceDataContext = createContext(null);

function parseCsv(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: reject,
    });
  });
}

export function InsuranceDataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError("");

      try {
        const [productRows, faqRows] = await Promise.all([
          parseCsv(productsCsvUrl),
          parseCsv(faqsCsvUrl),
        ]);

        if (!isMounted) {
          return;
        }

        setProducts(productRows);
        setFaqs(faqRows);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("We couldn't load insurance data right now.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const productFuse = useMemo(
    () =>
      new Fuse(products, {
        threshold: 0.33,
        ignoreLocation: true,
        keys: ["plan_name", "insurer_name", "key_benefits", "category"],
      }),
    [products],
  );

  const searchProducts = useMemo(
    () =>
      (query, category = "all", limit) => {
        let resultSet = products;
        if (query?.trim()) {
          resultSet = productFuse.search(query.trim()).map((item) => item.item);
        }

        if (category !== "all") {
          resultSet = resultSet.filter((item) => item.category === category);
        }

        return typeof limit === "number" ? resultSet.slice(0, limit) : resultSet;
      },
    [products, productFuse],
  );

  const value = useMemo(
    () => ({
      products,
      faqs,
      isLoading,
      error,
      searchProducts,
    }),
    [products, faqs, isLoading, error, searchProducts],
  );

  return (
    <InsuranceDataContext.Provider value={value}>
      {children}
    </InsuranceDataContext.Provider>
  );
}

export function useInsuranceData() {
  const context = useContext(InsuranceDataContext);
  if (!context) {
    throw new Error("useInsuranceData must be used inside InsuranceDataProvider");
  }
  return context;
}
