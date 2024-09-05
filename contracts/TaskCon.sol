// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;
import "./Strings.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // Import the ERC20 interface
import "./Tokens.sol";
/**
 * @title TaskCon
 * @dev Store & retrieve value in a variable
 */
contract TaskCon {
    IERC20 public CollaboratorToken;
    address public tokenaddress;

    address public owner;
    uint256 public Counter;

    mapping(address => uint256) public balances;

    constructor() {
        owner = msg.sender;
        tokenaddress = address(new MyTokenContract());
        CollaboratorToken = IERC20(tokenaddress);
        Counter = 0;
    }

    struct attempt {
        uint256 projectid;
        string tasktitle;
        uint256 taskid;
        string collaborator;
        uint256 status;
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
        uint256 isdone;
        string ownerman;
        string collaborator;
        uint256 reward;
    }

    project[] public projects;
    attempt[] public attempts;

    event AddProject(address recipient, uint256 projectid);
    event TaskFinished(uint256 projectId, uint256 taskId);

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function create_attempt(
        uint256 projectId,
        uint256 taskId,
        string memory tasktitle,
        string memory collaborator
    ) public {
        attempt memory NewAttempt = attempt({
            projectid: projectId,
            tasktitle: tasktitle,
            taskid: taskId,
            collaborator: collaborator,
            status: 0
        });

        attempts.push(NewAttempt);
    }

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
        string memory ownerman,
        uint rewardamount
    ) public {
        require(projectId > 0 && projectId <= Counter, "Invalid project ID");

        task memory newTask = task({ // Declare a new task here
            tasktitle: tasktitle, // Add initial values as needed
            description: description,
            isdone: 0,
            ownerman: ownerman,
            collaborator: "",
            reward: rewardamount
        });

        // for (uint i = 0;i< _attempts.length;i++){
        //     attempt memory newAttempt = _attempts[i];
        // }

        projects[projectId - 1].tasks.push(newTask);
    }

    function finishtask(
        uint256 projectId,
        uint256 taskId,
        string memory collaborator
    ) public {
        require(
            projectId > 0 && projectId <= projects.length,
            "Invalid project ID"
        );

        require(
            taskId > 0 && taskId <= projects[projectId - 1].tasks.length,
            "Invalid task ID"
        );

        task[] storage tasks = projects[projectId - 1].tasks;
        tasks[taskId - 1].isdone = 1;
        tasks[taskId - 1].collaborator = collaborator;

        // find the attempt whose projectid and taskid match the parameters and change its status
        for (uint256 i = 0; i < attempts.length; i++) {
            if (
                attempts[i].projectid == projectId &&
                attempts[i].taskid == taskId
            ) {
                attempts[i].status = 1;
                break;
            }
        }

        address collaboratorAddress = parseAddress(collaborator);
        uint256 rewardAmount = tasks[taskId - 1].reward;
        CollaboratorToken.transfer(collaboratorAddress, rewardAmount);

        emit TaskFinished(projectId, taskId); // Emit the event
    }

    function editProjectTitle(
        uint256 projectId,
        string memory newTitle
    ) public {
        require(projectId > 0 && projectId <= Counter, "Invalid project ID");
        projects[projectId - 1].title = newTitle;
    }

    function getfeed() external view returns (string memory) {
        project[] memory temporary = new project[](projects.length);
        uint256 feedcounter = 0;
        for (uint256 i = 0; i < projects.length; i++) {
            temporary[feedcounter] = projects[i];
            feedcounter++;
        }

        project[] memory result = new project[](feedcounter);
        for (uint256 i = 0; i < feedcounter; i++) {
            result[i] = temporary[i];
        }

        return projectsToJson(result);
    }

    function projectsToJson(
        project[] memory projectsArray
    ) internal pure returns (string memory) {
        bytes memory jsonBytes = abi.encodePacked("[");
        for (uint256 i = 0; i < projectsArray.length; i++) {
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
            '","description":"',
            proj.description,
            '","title":"',
            proj.title,
            '","tasks":['
        );
        for (uint256 i = 0; i < proj.tasks.length; i++) {
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
                    '","taskdesc":"',
                    tsk.description,
                    '","isdone":',
                    tsk.isdone == 1 ? "true" : "false",
                    ',"reward":',
                    Strings.uintToString(tsk.reward),
                    "}"
                )
            );
    }

    function getattempts() external view returns (string memory) {
        attempt[] memory temporary = new attempt[](attempts.length);
        uint256 attemptcounter = 0;
        for (uint256 i = 0; i < attempts.length; i++) {
            temporary[attemptcounter] = attempts[i];
            attemptcounter++;
        }

        attempt[] memory result = new attempt[](attemptcounter);
        for (uint256 i = 0; i < attemptcounter; i++) {
            result[i] = temporary[i];
        }

        return attemptsToJson(result);
    }

    function attemptsToJson(
        attempt[] memory attemptsArray
    ) internal pure returns (string memory) {
        bytes memory jsonBytes = abi.encodePacked("[");
        for (uint256 i = 0; i < attemptsArray.length; i++) {
            jsonBytes = abi.encodePacked(
                jsonBytes,
                attemptToJson(attemptsArray[i])
            );
            if (i < attemptsArray.length - 1) {
                jsonBytes = abi.encodePacked(jsonBytes, ",");
            }
        }
        jsonBytes = abi.encodePacked(jsonBytes, "]");
        return string(jsonBytes);
    }

    function attemptToJson(
        attempt memory att
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '{"projectid":"',
                    Strings.uintToString(att.projectid),
                    '","tasktitle":"',
                    att.tasktitle,
                    '","taskid":"',
                    Strings.uintToString(att.taskid),
                    '","collaborator":"',
                    att.collaborator,
                    '","status":',
                    att.status == 1 ? "true" : "false",
                    "}"
                )
            );
    }

    function parseAddress(string memory _a) internal pure returns (address) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint256 i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) b1 -= 87;
            else if ((b1 >= 65) && (b1 <= 70)) b1 -= 55;
            else if ((b1 >= 48) && (b1 <= 57)) b1 -= 48;
            if ((b2 >= 97) && (b2 <= 102)) b2 -= 87;
            else if ((b2 >= 65) && (b2 <= 70)) b2 -= 55;
            else if ((b2 >= 48) && (b2 <= 57)) b2 -= 48;
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
    }
}
