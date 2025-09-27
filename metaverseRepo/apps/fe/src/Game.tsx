import { useEffect, useRef, useState } from 'react';

const Arena = () => {
  const canvasRef = useRef<any>(null);
  const wsRef = useRef<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null); // current user separately
  const [users, setUsers] = useState(new Map());
  const [params, setParams] = useState({ token: '', spaceId: '' });

  // Initialize WebSocket connection and handle URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token') || '';
    const spaceId = urlParams.get('spaceId') || '';
    setParams({ token, spaceId });

    wsRef.current = new WebSocket('ws://localhost:3001'); 
    
    wsRef.current.onopen = () => {
      wsRef.current.send(JSON.stringify({
        type: 'join',
        payload: {
          spaceId,
          token
        }
      }));
    };
 
    wsRef.current.onmessage = (event: any) => {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case 'space-joined': {
        const myUserId = message.payload.spawn.userId;

        setCurrentUser({
          x: message.payload.spawn.x,
          y: message.payload.spawn.y,
          userId: myUserId
        });

        // Exclude current user from users map
        const userMap = new Map();
        message.payload.users
          .filter((user: any) => user.userId !== myUserId)
          .forEach((user: any) => {
            userMap.set(user.userId, user);
          });
        setUsers(userMap);
        break;
      }

      case 'user-joined':
        setUsers(prev => {
          const newUsers = new Map(prev);
          if (message.payload.userId !== currentUser?.userId) {
            newUsers.set(message.payload.userId, {
              x: message.payload.x,
              y: message.payload.y,
              userId: message.payload.userId
            });
          }
          return newUsers;
        });
        break;

      case 'movement':
        setUsers(prev => {
          const newUsers = new Map(prev);
          const userId = message.payload.userId;

          if (userId === currentUser?.userId) {
            //@ts-ignore
            setCurrentUser(prev => ({
              ...prev,
              x: message.payload.x,
              y: message.payload.y
            }));
            return newUsers;
          }

          const user = newUsers.get(userId);
          if (user) {
            user.x = message.payload.x;
            user.y = message.payload.y;
            newUsers.set(userId, user);
          }
          return newUsers;
        });
        break;

      case 'movement-rejected':
        setCurrentUser((prev: any) => ({
          ...prev,
          x: message.payload.x,
          y: message.payload.y
        }));
        break;

      case 'user-left':
        setUsers(prev => {
          const newUsers = new Map(prev);
          newUsers.delete(message.payload.userId);
          return newUsers;
        });
        break;
    }
  };

  // Send move request
  const handleMove = (newX: number, newY: number) => {
    if (!currentUser) return;
    wsRef.current.send(JSON.stringify({
      type: 'move',
      payload: {
        x: newX,
        y: newY,
        userId: currentUser.userId
      }
    }));
  };

  // Canvas drawing effect for all users
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#eee';
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw current user (red circle)
    if (currentUser && currentUser.x !== undefined) {
      ctx.beginPath();
      ctx.fillStyle = '#FF6B6B';
      ctx.arc(currentUser.x * 50, currentUser.y * 50, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('You', currentUser.x * 50, currentUser.y * 50 + 40);
    }

    // Draw other users (blue circles)
    users.forEach(user => {
      if (user.x === undefined) return;
      ctx.beginPath();
      ctx.fillStyle = '#4ECDC4';
      ctx.arc(user.x * 50, user.y * 50, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`User ${user.userId}`, user.x * 50, user.y * 50 + 40);
    });
  }, [currentUser, users]);

  // Movement controls via arrow keys
  const handleKeyDown = (e: any) => {
    if (!currentUser) return;
    const { x, y } = currentUser;
    switch (e.key) {
      case 'ArrowUp': handleMove(x, y - 1); break;
      case 'ArrowDown': handleMove(x, y + 1); break;
      case 'ArrowLeft': handleMove(x - 1, y); break;
      case 'ArrowRight': handleMove(x + 1, y); break;
    }
  };

  return (
    <div className="p-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1 className="text-2xl font-bold mb-4">Arena</h1>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Token: {params.token}</p>
        <p className="text-sm text-gray-600">Space ID: {params.spaceId}</p>
        <p className="text-sm text-gray-600">Connected Users: {users.size + (currentUser ? 1 : 0)}</p>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          width={2000}
          height={2000}
          className="bg-white"
        />
      </div>
      <p className="mt-2 text-sm text-gray-500">Use arrow keys to move your avatar</p>
    </div>
  );
};

export default Arena;
