import './DrawingViewWrapper.css';
import { Entity } from '@dojoengine/recs';
import React, { useState, useEffect, useRef } from 'react';
import { DrawingInfos } from '../customTypes';
import { Account } from 'starknet';
import DrawingView from './DrawingView';
import { getEntityIdFromKeys } from '@dojoengine/utils';
import Loading from './Loading';

interface DrawingViewWrapperProps {
  drawing: DrawingInfos;
  account: Account | undefined;
}

function getEntitiesFromDrawing(drawing: DrawingInfos | undefined): Entity[] {
  if (!drawing) {
    return [];
  }
  console.log("compute all possible entities");
  let entities: Entity[] = [];

  for (let x = 0; x < drawing.pixelsColumnCount; x++) {
    for (let y = 0; y < drawing.pixelsRowCount; y++) {
      entities.push(getEntityIdFromKeys([BigInt(drawing.id), BigInt(x), BigInt(y)]));
    }
  }
  return entities;
}

const DrawingViewWrapper: React.FC<DrawingViewWrapperProps> = ({ account, drawing }) => {
  const [loading, setLoading] = useState(true);  // State for loading
  const entitiesRef = useRef<Entity[]>([]);  // Ref to store the computed entities

  useEffect(() => {
    setLoading(true);

    const computeEntities = async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          // Simulate async entity computation with setTimeout
          const computedEntities = getEntitiesFromDrawing(drawing);
          entitiesRef.current = computedEntities;  // Store the result in the ref
          resolve();  // Resolve the promise after the computation
        }, 50);  // Minimal delay to allow render
      });

      setLoading(false);
    };

    computeEntities();

  }, [drawing]);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <DrawingView entities={entitiesRef.current} drawing={drawing} account={account} />
  );
};

export default DrawingViewWrapper;
