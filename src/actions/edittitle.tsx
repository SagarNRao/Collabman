import React, { useState } from 'react';
import { ethers } from 'ethers';
import TaskCon from "../../artifacts-zk/contracts/TaskCon.sol/TaskCon.json";
import { Textarea } from '@/components/ui/textarea';

interface EditProjectTitleProps {
  contractAddress: string;
  abi: any;
}

const contractAddress = "0xC6Fa8C41F689E9DD59a4Ecb7EC9e49e797Db5B79"
const abi = TaskCon.abi;

const EditProjectTitle: React.FC= () => {
  const [projectId, setProjectId] = useState<number>(0);
  const [newTitle, setNewTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleProjectIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectId(Number(e.target.value));
  };

  const handleNewTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.editProjectTitle(projectId, newTitle);
      await tx.wait();

      setSuccess('Project title updated successfully');
    } catch (error) {
        console.log(error);
    } finally {
      setLoading(false);
    }
  };

return (
    <div>
        <h2>Edit Project Title</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="projectId">Project ID:</label>
                <input
                    className='bg-black'
                    type="number"
                    id="projectId"
                    value={projectId}
                    onChange={handleProjectIdChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="newTitle">New Title:</label>
                <input
                    className='bg-black'
                    type="text"
                    id="newTitle"
                    value={newTitle}
                    onChange={handleNewTitleChange}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Title'}
            </button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
);
};

export default EditProjectTitle;