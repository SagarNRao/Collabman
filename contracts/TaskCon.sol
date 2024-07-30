// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;
import "./Strings.sol";
// import "./Tokens.sol";
/**
 * @title TaskCon
 * @dev Store & retrieve value in a variable
 */
contract TaskCon {
    address public owner;
    address public tokenaddress;
    uint256 public Counter;

    constructor() {
        owner = msg.sender;
        // tokenaddress = address(new MyTokenContract());
        Counter = 0;
    }

    struct project {
        string title;
        string description;
        string url;
        task[] tasks;
        string projectid;
    }

    struct task {
        string tasktitle;
        string description;
        bool isdone;
    }

    project[] public projects;

    event AddProject(address recipient, uint256 projectid);

    function addProject(
        string memory _title,
        string memory _description,
        string memory _url,
        task[] memory _tasks
    ) public {
        Counter++; // Increment the project counter

        project storage newProject = projects.push();
        newProject.title = _title;
        newProject.description = _description;
        newProject.url = _url;
        newProject.projectid = Strings.uintToString(Counter);

        for (uint256 i = 0; i < _tasks.length; i++) {
            task memory newTask = _tasks[i];
            newProject.tasks.push(newTask);
        }

        emit AddProject(msg.sender, Counter);
    }


    function getProjectTasks(
        uint256 projectId
    ) public view returns (task[] memory) {
        require(projectId > 0 && projectId <= Counter, "Invalid project ID");
        return projects[projectId - 1].tasks;
    }

    function addtasks(
        uint256 projectId,
        string memory tasktitle,
        string memory description
    ) public {
        require(projectId > 0 && projectId <= Counter, "Invalid project ID");

        task memory newTask = task({ // Declare a new task here
            tasktitle: tasktitle, // Add initial values as needed
            description: description,
            isdone: false
        });

        projects[projectId - 1].tasks.push(newTask);
    }

    function finishtasks(uint256 projectId, string memory tasktitle) public {
        require(projectId > 0 && projectId <= Counter, "Invalid project ID");
        task[] storage tasks = projects[projectId - 1].tasks;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (
                keccak256(abi.encodePacked(tasks[i].tasktitle)) ==
                keccak256(abi.encodePacked(tasktitle))
            ) {
                tasks[i].isdone = true;
                break;
            }
        }
    }
}
