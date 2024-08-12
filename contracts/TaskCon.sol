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
        Counter = 1;
    }

    struct project {
        string title;
        string description;
        string url;
        task[] tasks;
        string projectid;
        string ownerman;
    }

    struct task {
        string tasktitle;
        string description;
        bool isdone;
        string ownerman;
    }

    project[] public projects;

    event AddProject(address recipient, uint256 projectid);
    event TaskFinished(
        uint256 projectId,
        string tasktitle,
        string collaborator
    );

    function addProject(
        string memory _title,
        string memory _description,
        string memory _url,
        task[] memory _tasks,
        string memory ownerman
    ) public {
        Counter++; // Increment the project counter

        project storage newProject = projects.push();
        newProject.title = _title;
        newProject.description = _description;
        newProject.url = _url;
        newProject.projectid = Strings.uintToString(Counter);
        newProject.ownerman = ownerman;

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
        string memory description,
        string memory ownerman
    ) public {
        require(projectId > 0 && projectId <= Counter, "Invalid project ID");

        task memory newTask = task({ // Declare a new task here
            tasktitle: tasktitle, // Add initial values as needed
            description: description,
            isdone: false,
            ownerman: ownerman
        });

        projects[projectId - 1].tasks.push(newTask);
    }

    function finishtask(
        string memory projectTitle,
        string memory tasktitle,
        string memory collaborator
    ) public {
        for (uint256 i = 0; i < projects.length; i++) {
            if (
                keccak256(abi.encodePacked(projects[i].title)) ==
                keccak256(abi.encodePacked(projectTitle))
            ) {
                task[] storage tasks = projects[i].tasks;
                for (uint256 j = 0; j < tasks.length; j++) {
                    if (
                        keccak256(abi.encodePacked(tasks[j].tasktitle)) ==
                        keccak256(abi.encodePacked(tasktitle)) &&
                        keccak256(abi.encodePacked(tasks[j].ownerman)) ==
                        keccak256(abi.encodePacked(collaborator))
                    ) {
                        projects[i].tasks[j].isdone = true;
                        emit TaskFinished(i + 1, tasktitle, collaborator); // Emit the event
                        break;
                    }
                }
                break;
            }
        }
    }

    function getfeed() external view returns (string memory) {
        project[] memory temporary = new project[](projects.length);
        uint feedcounter = 0;
        for (uint i = 0; i < projects.length; i++) {
            temporary[feedcounter] = projects[i];
            feedcounter++;
        }

        project[] memory result = new project[](feedcounter);
        for (uint i = 0; i < feedcounter; i++) {
            result[i] = temporary[i];
        }

        return projectsToJson(result);
    }
    function projectsToJson(
        project[] memory projectsArray
    ) internal pure returns (string memory) {
        bytes memory jsonBytes = abi.encodePacked("[");
        for (uint i = 0; i < projectsArray.length; i++) {
            jsonBytes = abi.encodePacked(
                jsonBytes,
                projectToJson(projectsArray[i])
            );
            if (i < projectsArray.length - 1) {
                jsonBytes = abi.encodePacked(jsonBytes, ",");
            }
        }
        jsonBytes = abi.encodePacked(jsonBytes, "]");
        return string(jsonBytes);
    }

    function projectToJson(
        project memory proj
    ) internal pure returns (string memory) {
        bytes memory jsonBytes = abi.encodePacked(
            '{"projectid":"',
            proj.projectid,
            '","title":"',
            proj.title,
            '","tasks":['
        );
        for (uint i = 0; i < proj.tasks.length; i++) {
            jsonBytes = abi.encodePacked(jsonBytes, taskToJson(proj.tasks[i]));
            if (i < proj.tasks.length - 1) {
                jsonBytes = abi.encodePacked(jsonBytes, ",");
            }
        }
        jsonBytes = abi.encodePacked(jsonBytes, "]}");
        return string(jsonBytes);
    }

    function taskToJson(task memory tsk) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '{"tasktitle":"',
                    tsk.tasktitle,
                    '","isdone":',
                    tsk.isdone ? "true" : "false",
                    "}"
                )
            );
    }
}
