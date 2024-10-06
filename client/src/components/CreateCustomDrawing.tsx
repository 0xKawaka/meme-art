// import React, { useState } from 'react';
// import './CreateDrawing.css';
// import { useDojo } from '../dojo/useDojo';
// import { Account } from 'starknet';

// interface CreateDrawingProps {
//   account: Account;
//   handleCreateDrawing: (newDrawing: { id: number, name: string; pixelsRowCount: number; creator: string }) => void;
// }

// const CreateCustomDrawing: React.FC<CreateDrawingProps> = ({ account, handleCreateDrawing }) => {
//   const [name, setName] = useState('');
//   const [pixelsRowCount, setPixelsRowCount] = useState<number>();
//   const [totalMarketcap, setTotalMarketcap] = useState<number>(); // New state for totalMarketcap
//   const [isCreating, setIsCreating] = useState(false);
//   const { setup: { systemCalls: { createDrawing } } } = useDojo();

//   const handleSubmit = async () => {
//     if (name && pixelsRowCount && totalMarketcap) {
//       setIsCreating(true);
//       let drawingId = await createDrawing(account, name, pixelsRowCount, totalMarketcap, '0x1');
//       setIsCreating(false);
//       if (drawingId != -1) {
//         handleCreateDrawing({ id: drawingId, name, pixelsRowCount: pixelsRowCount, creator: account.address });
//       }
//     }
//   };

//   // Handle input changes and prevent non-numeric input for pixelsRowCount
//   const handlePixelsRowCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     if (/^\d*$/.test(value)) {
//       setPixelsRowCount(value ? Number(value): undefined);
//     }
//   };

//   // Handle input changes and prevent non-numeric input for totalMarketcap
//   const handleTotalMarketcapChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     if (/^\d*$/.test(value)) {
//       setTotalMarketcap(value ? Number(value): undefined);
//     }
//   };

//   return (
//     <div className="create-drawing">
//       <div>Create New Drawing</div>
//       <div className="create-drawing-container">
//         <div className="form-field">
//           <div className="input-title">Drawing Name</div>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-field">
//           <div className="input-title">Pixels per side</div>
//           <input
//             type="text"
//             value={pixelsRowCount ? pixelsRowCount.toString(): ''}
//             onChange={handlePixelsRowCountChange}
//             required
//             inputMode="numeric"
//             pattern="\d*"
//             min="1"
//           />
//           <div className="input-description">{pixelsRowCount}{pixelsRowCount && pixelsRowCount > 0 && 'x'}{pixelsRowCount} Square</div>
//         </div>
//         <div className="form-field">
//           <div className="input-title">Total Marketcap</div>
//           <input
//             type="text"
//             value={totalMarketcap ? totalMarketcap.toString() : ''}
//             onChange={handleTotalMarketcapChange}
//             required
//             inputMode="numeric"
//             pattern="\d*"
//             min="1"
//           />
//         </div>
//         {isCreating ?
//           <div className="submit-btn">
//             Creating...
//           </div>
//           :
//           <div className="submit-btn" onClick={handleSubmit}>
//             Create
//           </div>
//         }
//       </div>
//     </div>
//   );
// };

// export default CreateCustomDrawing;
