// Frontend/Task-Manager/src/pages/Admin/CreateTask.jsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { LuTrash2 } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteAlert from "../../components/DeleteAlert";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Modal from "../../components/Modal";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { PRIORITY_DATA } from "../../utils/data";


const CreateTask = () => {

const location = useLocation();
const { taskId } = location.state || {};


  const navigate = useNavigate();
  
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
    assignedTo: [],
    todoCheckList: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);

  const [ error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

const handleValueChange = (key, value) => {
  console.log(`Updating taskData -> ${key}:`, value); // 🔍 Debug output
  setTaskData((prevData) => ({ ...prevData, [key]: value }));
};


  const clearData = () => {

    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: null,
      assignedTo: [],
      todoCheckList: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);

    try{
      const todoList = taskData.todoChecklist?.map((item) =>({
        text: item,
        completed: false,
      }));

      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,

      });
      toast.success("Task Created Successfully");
      
      clearData();
    } catch (error) {
      console.error("Error creating task:",error);
      setLoading(false);
    } finally {
      setLoading(false);
    }

  };

const updateTask = async () => {
  setLoading(true);

  try {
    const prevTodoChecklist = currentTask?.todoCheckList || [];

    const todoList = taskData.todoCheckList?.map((item) => {
      const matchedTask = prevTodoChecklist.find((task) => task.text === item);
      return {
        text: item,
        completed: matchedTask ? matchedTask.completed : false,
      };
    });

    const response = await axiosInstance.put(
      API_PATHS.TASKS.UPDATE_TASK(taskId),
      {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoCheckList: todoList,
      }
    );

    toast.success("Task Updated Successfully");
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("Failed to update task");
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = async () => {
    setError(null);

    if (!taskData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!taskData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!taskData.dueDate){
      setError("Due date is required.");
      return;
    }

    if (taskData.todoCheckList?.length === 0){
      setError("Add at least one todo task");
    }

  if(taskId){
    updateTask();
    return;
  }

  createTask();
};

  const getTaskDetailsByID = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
    );

    if (response.data) {
      const taskInfo = response.data;
      setCurrentTask(taskInfo);

      setTaskData({
        title: taskInfo.title,
        description: taskInfo.description,
        priority: taskInfo.priority,
        dueDate: taskInfo.dueDate
          ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
          : null,
        assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
        todoCheckList:
          taskInfo?.todoCheckList?.map((item) => item?.text) || [],
        attachments: taskInfo?.attachments || [],
      });
    }
  } catch (error) {
    console.error("Error fetching task details:", error);
  }
};

//Delete Task
const deleteTask = async () => {
  try{
    await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

    setOpenDeleteAlert(false);
    toast.success("Expense details deleted successfully");
    navigate('/admin/tasks')
  
  }catch (error) {
    console.error(
      "Error deleting expense:",
      error.response?.data?.message || error.message
    );
  }
};

useEffect(() => {
  if(taskId){
    getTaskDetailsByID(taskId)
  }

  return () => {}
}, [taskId])



  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
       <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
        <div className="form-card col-span-3">
       <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-xl font-medium">
          {taskId ? "Update Task" : "Create Task"}
        </h2>
        {taskId && (
          <button
          className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
          onClick={() => setOpenDeleteAlert(true)}
          >
            <LuTrash2 className="text-base" /> Delete
          </button>
        )}
       </div>
       <div className="mt-4">
        <label className="text-xs font-medium text-slate-600">
          Task Title

        </label>
        <input
        placeholder="Create App UI"
        className="form-input"
        value={taskData.title}
        onChange={({ target }) =>
          handleValueChange("title", target.value)
      }
      />
      </div>
      <div className="mt-3">
        <label className="text-xs font-medium text-slate-600">
          Description
        </label>
        <textarea
        placeholder="Describe task"
        className="form-input"
        rows={4}
        value={taskData.description}
        onChange={({ target }) =>
          handleValueChange("description", target.value)
      
      }
      />
      </div>
      <div className="grid grid-cols-12 gap-4 mt-2">
        <div className="col-span-6 md:col-span-4">
          <label className="text-xs font-medium text-slate-600">
            Priority

          </label>
          <SelectDropdown
            options={PRIORITY_DATA}
            value={taskData.priority}
            onChange={(value) => handleValueChange("priority",value)}
            placeholders="Select Priority"
            />
        </div>

        <div className="col-span-6 md:col-span-4">
          <label className="text-xs font-medium text-slate-600">
            Due Date
          </label>
          <input
          placeholder="Create App UI"
          className="form-input"
          value={taskData.dueDate ?? ""}
          onChange={({ target }) =>
          handleValueChange("dueDate", target.value)
          }
          type="date"
          />
        </div>

        <div className="col-span-12 md:col-span-3">
          <label className="text-xs font-medium text-slate-600">
            Assign To
          </label>
          <SelectUsers
          selectedUsers={taskData.assignedTo}
          setSelectedUsers={(value) => {
            handleValueChange("assignedTo", value);
          }}
          />
        </div>

      </div>
      <div className="mt-3">
        <TodoListInput
  todoList={taskData?.todoCheckList}
  setTodoList={(value) =>
    handleValueChange("todoCheckList", value)
  }
/>

          </div>
{/* //3:27:58 / 4:52:22 */}


          <div className="mt-3">
  <label className="text-xs font-medium text-slate-600">
    Add Attachments
  </label>

  <AddAttachmentsInput
    attachments={taskData?.attachments}
    setAttachments={(value) => handleValueChange("attachments", value)}
  />
</div>
        {
          error && (
            <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
          )
        }

        <div className="flex justify-end mt-7">
          <button
            className="add-btn"
            onClick={handleSubmit}
            disabled={loading}
            >
              {taskId ? "UPDATE TASK" : "CREATE TASK"}
            </button>
        </div>

        </div>
        </div>
      </div>

      <Modal
      isOpen={openDeleteAlert}
      onClose={() => setOpenDeleteAlert(false)}
      title="Delete Task"
      >
        <DeleteAlert
        content="Are you sure you want to delete this task?"
        onDelete={() => deleteTask()}
        />
      </Modal>

    </DashboardLayout>
  );
};

export default CreateTask;
