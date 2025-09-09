import { Checkbox, Col, Form, Input, Row } from "antd";
import { debounce } from "lodash";
import { type PropsWithChildren } from "react";
import type { IStepInstance } from "@wizard/types";
import { FormWapper } from "@components";

interface AddPlanStepProps extends PropsWithChildren {
  activeStep: IStepInstance;
  nextStep: () => void;
}

const AddPlanStep = ({ children, activeStep, nextStep }: AddPlanStepProps) => {
  return (
    <>
      <Row>
        <Col span={24}>
          <FormWapper
            disabled={!!activeStep.getStepData()}
            antFormProps={{
              onFinish: (values: any) => {
                activeStep.setState(() => {
                  return values;
                });
                nextStep();
              },
              initialValues: activeStep.getStepData(),
            }}
          >
            <Form.Item
              label="Plan Name"
              name="name"
              rules={[
                { required: true, message: "Please enter plan name!" },
                { min: 2, message: "Plan name must be at least 2 characters!" },
              ]}
            >
              <Input placeholder="Plan name" size="large" />
            </Form.Item>

            <Form.Item name="isExtraInfoRequired" valuePropName="checked">
              <Checkbox>Description is required for the plan</Checkbox>
            </Form.Item>
            {children}
          </FormWapper>
        </Col>
      </Row>
    </>
  );
};

export { AddPlanStep };
