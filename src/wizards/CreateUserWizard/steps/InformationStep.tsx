import { Col, Form, Input, Row, DatePicker } from "antd";
import { type PropsWithChildren } from "react";
import { FormWapper } from "../components";
import { IStepInstance } from "src/Wizard/types";

interface InformationStepProps extends PropsWithChildren {
  activeStep: IStepInstance;
  nextStep: () => void;
  getStates: (name: string) => any;
}

const InformationStep = ({
  children,
  activeStep,
  nextStep,
  getStates,
}: InformationStepProps) => {
  // Determine if description is required based on selected plan
  const planData = getStates("plan");
  const isDescriptionRequired = planData?.isExtraInfoRequired || false;

  return (
    <Row>
      <Col span={24}>
        <FormWapper
          disabled={activeStep.isComplete}
          antFormProps={{
            onFinish: (values) => {
              activeStep.setState(() => {
                return values;
              });
              nextStep();
            },
            initialValues: activeStep.getStepData(),
          }}
        >
          <Form.Item
            label="First name:"
            name="firstName"
            required
            rules={[
              { required: true, message: "Please enter first name!" },
              { min: 2, message: "First name must be at least 2 characters!" },
            ]}
          >
            <Input placeholder="First name" size="large" />
          </Form.Item>

          <Form.Item
            label="Last name:"
            name="lastName"
            required
            rules={[
              { required: true, message: "Please enter last name!" },
              { min: 2, message: "Last name must be at least 2 characters!" },
            ]}
          >
            <Input placeholder="Last name" size="large" />
          </Form.Item>

          <Form.Item
            label="Age:"
            name="age"
            rules={[
              { required: true, message: "Please enter age!" },
              {
                type: "number",
                min: 1,
                max: 120,
                message: "Age must be between 1 and 120!",
              },
            ]}
          >
            <Input placeholder="Age" size="large" type="number" />
          </Form.Item>

          <Form.Item
            label="E-mail:"
            name="email"
            rules={[
              { required: true, message: "Please enter email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="E-mail" size="large" type="email" />
          </Form.Item>

          <Form.Item
            label="Start date:"
            name="startDate"
            rules={[{ required: true, message: "Please select start date!" }]}
          >
            <DatePicker
              placeholder="dd-----yyyy"
              size="large"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            label="Location:"
            name="location"
            rules={[
              { required: true, message: "Please enter location!" },
              { min: 2, message: "Location must be at least 2 characters!" },
            ]}
          >
            <Input placeholder="Location" size="large" />
          </Form.Item>

          <Form.Item
            label="Language:"
            name="language"
            rules={[
              { required: true, message: "Please enter language!" },
              { min: 2, message: "Language must be at least 2 characters!" },
            ]}
          >
            <Input placeholder="Language" size="large" />
          </Form.Item>

          <Form.Item
            label="Description:"
            name="description"
            rules={[
              ...(isDescriptionRequired
                ? [{ required: true, message: "Please enter description!" }]
                : []),
              { min: 3, message: "Description must be at least 3 characters!" },
            ]}
          >
            <Input.TextArea
              placeholder="Type the description..."
              size="large"
              rows={4}
              style={{ resize: "vertical" }}
            />
          </Form.Item>
          {children}
        </FormWapper>
      </Col>
    </Row>
  );
};

export { InformationStep };
