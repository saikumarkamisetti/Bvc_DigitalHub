import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import AuthCard from "../components/ui/AuthCard";
import PageContainer from "../components/ui/PageContainer";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      toast.success(res.data.message);
      navigate("/onboarding");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <PageContainer>
        <AuthCard title="Invalid Request">
          <p className="text-center text-red-500">
            Please sign up again.
          </p>
        </AuthCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <AuthCard title="Verify OTP">
        <form onSubmit={handleVerify} className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Enter the OTP sent to <b>{email}</b>
          </p>

          <Input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>
      </AuthCard>
    </PageContainer>
  );
};

export default OTP;
