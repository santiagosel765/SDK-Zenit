import React from 'react';
import type { ZenitClient } from '../config/ZenitSdkConfig';

export interface ZenitMapProps {
  client: ZenitClient;
  mapId: string | number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Placeholder map component wired to accept a ZenitClient instance.
 * Future iterations will fetch map details and render a full map.
 */
export const ZenitMap: React.FC<ZenitMapProps> = (props) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8, ...props.style }} className={props.className}>
      <strong>ZenitMap placeholder</strong>
      <div>Map ID: {props.mapId}</div>
      <div>Este componente se conectará al backend Zenit vía zenit-sdk.</div>
    </div>
  );
};
