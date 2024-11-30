// 'use client'

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Topic } from '../types';
// import { AVAILABLE_TOPICS } from '../lib/topics';



// export default function TopicSelection({ onComplete }: { onComplete: (topics: Topic[]) => void }) {
//   const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
//   const MAX_TOPICS = 5;

//   const toggleTopic = (topicId: string) => {
//     const newSelection = new Set(selectedTopics);
//     if (selectedTopics.has(topicId)) {
//       newSelection.delete(topicId);
//     } else if (selectedTopics.size < MAX_TOPICS) {
//       newSelection.add(topicId);
//     }
//     setSelectedTopics(newSelection);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <div className="max-w-md mx-auto">
//         <h1 className="text-3xl font-bold mb-2">Pick your topics</h1>
//         <p className="mb-6 text-gray-400">Choose up to {MAX_TOPICS} topics you're interested in</p>
        
//         <div className="grid grid-cols-2 gap-4 mb-8">
//           {AVAILABLE_TOPICS.map(topic => (
//             <button
//               key={topic.id}
//               onClick={() => toggleTopic(topic.id)}
//               className={`${topic.color} p-4 rounded-lg transition-transform ${
//                 selectedTopics.has(topic.id) 
//                   ? 'ring-2 ring-white scale-105' 
//                   : 'opacity-70 hover:opacity-100'
//               }`}
//             >
//               {topic.name}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={() => onComplete(AVAILABLE_TOPICS.filter(t => selectedTopics.has(t.id)))}
//           disabled={selectedTopics.size === 0}
//           className="w-full py-3 bg-white text-black rounded-lg disabled:opacity-50"
//         >
//           Start Learning ({selectedTopics.size}/{MAX_TOPICS})
//         </button>
//       </div>
//     </div>
//   );
// }
'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Topic } from '../types';
import { AVAILABLE_TOPICS } from '../lib/topics';

export default function TopicSelection({ onComplete }: { onComplete: (topics: Topic[]) => void }) {
    const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
    const MAX_TOPICS = 5;
  
    const toggleTopic = (topicId: string) => {
      const newSelection = new Set(selectedTopics);
      if (selectedTopics.has(topicId)) {
        newSelection.delete(topicId);
      } else if (selectedTopics.size < MAX_TOPICS) {
        newSelection.add(topicId);
      }
      setSelectedTopics(newSelection);
    };
  
    return (
      <div className="min-h-screen bg-black p-6">
        <div className="max-w-md mx-auto pt-12">
          <h1 className="text-4xl text-white font-bold mb-2 text-center">
            Tired of mindless scrolling?
          </h1>
          <p className="mb-12 text-center text-white/60">
            Turn it into a fun learning experience
          </p>
          
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {AVAILABLE_TOPICS.map(topic => (
              <motion.button
                key={topic.id}
                onClick={() => toggleTopic(topic.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full text-white text-lg
                  ${topic.color} 
                  ${selectedTopics.has(topic.id) 
                    ? 'ring-2 ring-white' 
                    : 'opacity-90'}`}
              >
                {topic.name}
              </motion.button>
            ))}
          </div>
  
          <motion.button
            onClick={() => onComplete(AVAILABLE_TOPICS.filter(t => selectedTopics.has(t.id)))}
            disabled={selectedTopics.size === 0}
            whileHover={selectedTopics.size > 0 ? { scale: 1.02 } : {}}
            whileTap={selectedTopics.size > 0 ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-full text-xl font-medium relative
              ${selectedTopics.size === 0 
                ? 'bg-white/20 text-white/40 cursor-not-allowed' 
                : 'bg-white text-black'}`}
          >
            {selectedTopics.size === 0 ? (
              'Select topics'
            ) : (
              <>
                Continue
                <span className="absolute right-6 text-base opacity-70">
                  {selectedTopics.size}/{MAX_TOPICS}
                </span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    );
  }