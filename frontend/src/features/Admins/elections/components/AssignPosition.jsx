import React, { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  Box,
  Group,
  Title,
  Divider,
  Flex,
  Modal,
  Text,
  Grid,
} from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useDispatch, useSelector } from "react-redux";
import {
  assignElectionsPositions,
  viewAssignElectionsPositions,
} from "../actions/electionAction";
import { toast } from "react-toastify";

const AssignPosition = ({ opened, close, selectedElection }) => {
  const dispatch = useDispatch();
  const { electionPositionList } = useSelector((store) => store.elections);

  const [positions, setPositions] = useState([
    { id: 1, title: "", contenders: "", elected: "" },
  ]);

  useEffect(() => {
    dispatch(
      viewAssignElectionsPositions({ electionId: selectedElection?._id })
    );
  }, [dispatch, selectedElection?._id]);

  useEffect(() => {
    if (electionPositionList?.data?.length < 0) return;
    const existingPositions = [];
    electionPositionList?.data?.map((position) => {
      existingPositions.push({
        id: position._id,
        title: position.position,
        contenders: position.contenders,
        elected: position.elected,
      });
    });

    setPositions([...existingPositions]);
  }, [electionPositionList?.data]);

  const addPosition = () => {
    const newId = positions.length + 1;
    setPositions([
      ...positions,
      { id: newId, title: "", contenders: "", elected: "" },
    ]);
  };

  const removePosition = (id) => {
    if (positions.length > 1) {
      setPositions(positions.filter((position) => position.id !== id));
    }
  };

  const handlePositionChange = (id, field, value) => {
    setPositions(
      positions.map((position) =>
        position.id === id ? { ...position, [field]: value } : position
      )
    );
  };

  const onSave = () => {
    const data = {
      positions: positions,
      electionId: selectedElection?._id,
    };

    if (electionPositionList?.data?.length > 0) {
      data.action = "update";
    } else {
      data.action = "add";
    }

    const loadingId = toast.loading("Assigning positions...");
    dispatch(
      assignElectionsPositions(data, (err) => {
        toast.dismiss(loadingId);
        if (err) {
          toast.error(
            err.response.data.message || "Failed to assign positions"
          );
          return;
        }
        toast.success("Positions assigned successfully");
        close();
      })
    );
  };

  return (
    <>
      <Modal
        size="xl"
        opened={opened}
        onClose={close}
        title={
          <Title order={2} mb="sm">
            Assign Positions
          </Title>
        }
      >
        <Text fw="bold" fz="xl" c="brand">
          Election : {selectedElection?.title}
        </Text>

        <Box maw={1200} mx="auto" p="md">
          <Grid gutter="xl">
            {positions.map((position) => (
              <Grid.Col key={position.id} span={12}>
                <Box
                  p="md"
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "4px",
                    position: "relative",
                  }}
                >
                  <Flex direction="row" gap="md" align="flex-end" wrap="wrap">
                    <TextInput
                      label="Position Title"
                      placeholder="Enter position title"
                      required
                      value={position.title}
                      onChange={(e) =>
                        handlePositionChange(
                          position.id,
                          "title",
                          e.target.value
                        )
                      }
                    />

                    <TextInput
                      label="Contenders"
                      type="number"
                      placeholder="Add contenders"
                      value={position.contenders}
                      onChange={(e) =>
                        handlePositionChange(
                          position.id,
                          "contenders",
                          e.target.value
                        )
                      }
                    />

                    <TextInput
                      label="Elected"
                      type="number"
                      placeholder="Select elected candidate"
                      value={position.elected}
                      onChange={(e) =>
                        handlePositionChange(
                          position.id,
                          "elected",
                          e.target.value
                        )
                      }
                    />
                    {positions.length > 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        c={"red"}
                        color="red"
                        onClick={() => removePosition(position.id)}
                      >
                        <IconX size={20} />
                      </Button>
                    )}
                  </Flex>
                </Box>
              </Grid.Col>
            ))}
          </Grid>

          <Divider my="lg" />

          <Group justify="space-between">
            <Button
              leftSection={<IconPlus size={20} />}
              variant="outline"
              onClick={addPosition}
            >
              Add Position
            </Button>

            <Button onClick={onSave}>Save Positions</Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
};

export default AssignPosition;
