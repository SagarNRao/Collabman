// import { createThirdwebClient, defineChain, getContract } from "thirdweb";

// const clientId = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID;
// export const client = createThirdwebClient({
//   clientId: clientId as string,
// });

// export const chain = defineChain(11155111);
// const contractAddress = "0x62A71C820A229c38C9fc40a8DC71971EA1B7A034";

// const abi = [
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "address",
//         name: "recipient",
//         type: "address",
//       },
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "postId",
//         type: "uint256",
//       },
//     ],
//     name: "Addpost",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "postId",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "bool",
//         name: "isDeleted",
//         type: "bool",
//       },
//     ],
//     name: "Deletepost",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "postId",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "address",
//         name: "approver",
//         type: "address",
//       },
//     ],
//     name: "PostApproved",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "postId",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "address",
//         name: "liker",
//         type: "address",
//       },
//     ],
//     name: "PostLiked",
//     type: "event",
//   },
//   {
//     anonymous: false,
//     inputs: [
//       {
//         indexed: false,
//         internalType: "uint256",
//         name: "postId",
//         type: "uint256",
//       },
//       {
//         indexed: false,
//         internalType: "bool",
//         name: "isVerified",
//         type: "bool",
//       },
//     ],
//     name: "Validatepost",
//     type: "event",
//   },
//   {
//     inputs: [
//       {
//         internalType: "string",
//         name: "postText",
//         type: "string",
//       },
//       {
//         internalType: "bool",
//         name: "isDeleted",
//         type: "bool",
//       },
//     ],
//     name: "addpost",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     name: "approvals",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "_postId",
//         type: "uint256",
//       },
//     ],
//     name: "expertapprove",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [],
//     name: "getAllposts",
//     outputs: [
//       {
//         components: [
//           {
//             internalType: "uint256",
//             name: "id",
//             type: "uint256",
//           },
//           {
//             internalType: "address",
//             name: "username",
//             type: "address",
//           },
//           {
//             internalType: "string",
//             name: "postText",
//             type: "string",
//           },
//           {
//             internalType: "bool",
//             name: "isDeleted",
//             type: "bool",
//           },
//           {
//             internalType: "bool",
//             name: "isVerified",
//             type: "bool",
//           },
//           {
//             internalType: "uint256",
//             name: "likes",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "approvals",
//             type: "uint256",
//           },
//         ],
//         internalType: "struct MyValContract.post[]",
//         name: "",
//         type: "tuple[]",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "_postId",
//         type: "uint256",
//       },
//     ],
//     name: "likePost",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     name: "likes",
//     outputs: [
//       {
//         internalType: "uint256",
//         name: "",
//         type: "uint256",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   {
//     inputs: [
//       {
//         internalType: "uint256",
//         name: "_postId",
//         type: "uint256",
//       },
//     ],
//     name: "validatepost",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ] as const;

// export const ValidityContract = getContract({
//   client: client,
//   chain: chain,
//   address: contractAddress,
//   abi: abi,
// });
