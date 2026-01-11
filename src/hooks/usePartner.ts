import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useAuth } from "../contexts/AuthContext";

export function usePartner() {
  const { user } = useAuth();
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists() && doc.data().partnerId) {
        setPartnerId(doc.data().partnerId);
      } else {
        setPartnerId(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  return { partnerId, loading };
}