import React from "react";
import { Button, Col, Row, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import type { WizardClient } from "@wizard";

const { Title, Paragraph } = Typography;

export const SuccessView = (props: WizardClient) => {
  return (
    <Row justify="center" align="middle" className="min-h-96">
      <Col span={16} className="text-center">
        <div className="success-animation mb-8">
          <CheckCircleOutlined className="text-8xl text-green-500 mb-6 animate-bounce" />
        </div>

        <Title level={1} className="text-green-600 mb-6 font-bold">
          🎉 Account Created Successfully!
        </Title>

        <Paragraph className="text-lg mb-8 text-gray-600 leading-relaxed">
          Your account has been created successfully. You can now start using
          all the features and enjoy our platform.
        </Paragraph>

        <div className="success-actions">
          <Button
            type="primary"
            size="large"
            onClick={() => props.reset()}
            className="success-button"
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              borderRadius: "12px",
              height: "48px",
              padding: "0 32px",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(16, 185, 129, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(16, 185, 129, 0.3)";
            }}
          >
            Create Another Account
          </Button>
        </div>
      </Col>
    </Row>
  );
};
