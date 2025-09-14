import { Button, Col, Row, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useWizardClient } from "../../../Wizard/Provider";

const { Title, Paragraph } = Typography;
export const SuccessView = () => {
  const wizzardClient = useWizardClient();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="max-w-2xl w-full">
        <Row justify="center" align="middle">
          <Col span={24} className="text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 mx-4 transform transition-all duration-500 hover:scale-105">
              <div className="success-animation mb-8">
                <div className="relative">
                  <CheckCircleOutlined className="text-9xl text-green-500 mb-6 animate-bounce" />
                  <div className="absolute inset-0 bg-green-200 rounded-full opacity-20 animate-ping"></div>
                </div>
              </div>

              <Title
                level={1}
                className="text-green-600 mb-6 font-bold text-4xl"
              >
                🎉 Account Created Successfully!
              </Title>

              <Paragraph className="text-xl mb-10 text-gray-600 leading-relaxed max-w-lg mx-auto">
                Your account has been created successfully. You can now start
                using all the features and enjoy our platform.
              </Paragraph>

              <div className="success-actions">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => wizzardClient.resetWizard()}
                  className="success-button"
                  style={{
                    background:
                      "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    border: "none",
                    borderRadius: "16px",
                    height: "56px",
                    padding: "0 40px",
                    fontSize: "18px",
                    fontWeight: "700",
                    boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.05)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 35px rgba(16, 185, 129, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(16, 185, 129, 0.4)";
                  }}
                >
                  Create Another Account
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
