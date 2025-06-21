
import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = '6NyqkFLFWxC9mkkEU6ntshrtBhh+77ivcPNYzUql7auzUuyQJAX1p8a8avnSHv4ElqjrpsqQkQOuFfmInwyF5A==';

export default function useAnnouncementDetail(panId, params) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const res = await axios.get(
          'http://apis.data.go.kr/B552555/lhLeaseNoticeDtlInfo1/getLeaseNoticeDtlInfo1',
          { params: { serviceKey: API_KEY, PAN_ID: panId, ...params } }
        );
        setDetail({
          PAN_ID: res.data[0]?.dsSch?.[0]?.PAN_ID,
          dsCtrtPlc: res.data[1]?.dsCtrtPlc || [],
          dsSplScdl: res.data[1]?.dsSplScdl || [],
          dsEtcInfo: res.data[1]?.dsEtcInfo || [],
          dsAhflInfo: res.data[1]?.dsAhflInfo || [],
          dsSbdAhfl: res.data[1]?.dsSbdAhfl || [],

        });
      } catch (e) {
        setDetail(null);
      } finally {
        setLoading(false);
      }
    }
    if (panId) fetchDetail();
  }, [panId, params]);

  return { detail, loading };
}
