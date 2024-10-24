import React, { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { Button, Form, Modal, Row, Col, Checkbox } from "antd";
import { useData } from "./useData";
import { BASE_URL_OLT } from "libs/auth-api";
import axiosInstance from "utils/axiosInstance";

const useCompatible = ({ handleOpenSoftware, openSoftware, items }) => {
  const [form] = Form.useForm();
  const { refetch } = useData();
  const [id, setId] = useState("");
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const currentIdRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (items) {
      setId(items.id || "");
    }
  }, [items]);

  const fetchData = useCallback(async () => {
    if (!id) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    console.log("Fetching data for id:", id);
    currentIdRef.current = id;

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token is missing.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        signal,
      };

      const postResponse = await axiosInstance.post(
        `${BASE_URL_OLT}/oltmaster/merk/software`,
        { id },
        config
      );
      console.log("POST response for id", id, ":", postResponse.data);

      if (currentIdRef.current !== id) {
        console.log("ID changed, aborting further processing");
        return;
      }

      const getResponse = await axiosInstance.get(
        `${BASE_URL_OLT}/oltmaster/software`,
        config
      );
      console.log("GET response for id", id, ":", getResponse.data);

      if (currentIdRef.current !== id) {
        console.log("ID changed, aborting further processing");
        return;
      }

      if (Array.isArray(getResponse.data)) {
        setSoftwareOptions(getResponse.data);

        if (Array.isArray(postResponse.data) && postResponse.data.length > 0) {
          const postSoftwareIds = postResponse.data.map((item) => item.id);
          const matchingSoftwareIds = getResponse.data
            .filter((software) => postSoftwareIds.includes(software.id))
            .map((software) => software.id);
          setSelectedSoftware(matchingSoftwareIds);
        } else {
          setSelectedSoftware([]);
        }
      } else {
        console.error("GET response is not an array:", getResponse.data);
        setSoftwareOptions([]);
        setSelectedSoftware([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    if (openSoftware) {
      console.log("Modal opened, fetching data...");
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [openSoftware, fetchData]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        id: id,
        id_soft: selectedSoftware,
      };

      console.log("Submitting form data:", formData);

      const response = await toast.promise(
        axiosInstance.put(
          `${BASE_URL_OLT}/oltmaster/merk/software`,
          formData,
          config
        ),
        {
          pending: "Updating ...",
          success: "Updated Successfully!",
        }
      );

      if (response?.status === 200) {
        handleCancel();
        refetch();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedSoftware([]);
    handleOpenSoftware();
  };

  const onChangeCheckbox = (checkedValues) => {
    setSelectedSoftware(checkedValues);
  };

  return (
    <Modal
      open={openSoftware}
      onCancel={handleCancel}
      width={350}
      footer={null}
    >
      <div className="flex justify-between pr-7">
        <h1 className="mb-3 text-xl font-bold">Add Compatible Software</h1>
      </div>
      <Form
        form={form}
        name="control-hooks-compatible"
        style={{
          maxWidth: 300,
        }}
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Checkbox.Group
              style={{ width: "100%" }}
              onChange={onChangeCheckbox}
              value={selectedSoftware}
            >
              {softwareOptions.map((software) => (
                <Checkbox key={software.id} value={software.id}>
                  {software.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Col>

          <Col span={24}>
            <div className="mt-3 flex items-end justify-end">
              <Button className="bg-blue-500 text-white" htmlType="submit">
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default useCompatible;
