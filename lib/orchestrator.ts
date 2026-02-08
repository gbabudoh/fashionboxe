/**
 * Owncast Orchestration Layer
 * Manages dedicated Owncast containers for each brand using the Docker Engine API.
 */
import Docker from 'dockerode';

// Initialize Docker client (defaults to /var/run/docker.sock on Linux or //./pipe/docker_engine on Windows)
const docker = new Docker();

interface OwncastInstanceConfig {
  brandId: string;
  brandSlug: string;
  rtmpPort: number;
  webPort: number;
}

export class OwncastOrchestrator {
  private static DOCKER_IMAGE = 'owncast/owncast:latest';

  /**
   * Provisions a new Owncast container for a brand.
   * Maps specific RTMP and Web ports and mounts a volume for persistent data.
   */
  async provisionInstance(config: OwncastInstanceConfig) {
    console.log(`[ORCHESTRATOR] Provisioning Owncast instance for ${config.brandSlug}...`);
    
    try {
      const containerName = `fashionboxe-store-${config.brandSlug}`;
      
      // Check if container already exists to avoid conflicts
      const existingContainers = await docker.listContainers({ all: true, filters: { name: [containerName] } });
      if (existingContainers.length > 0) {
        console.log(`[ORCHESTRATOR] Container ${containerName} already exists.`);
        const container = docker.getContainer(existingContainers[0].Id);
        
        // Ensure it's running
        if (existingContainers[0].State !== 'running') {
            await container.start();
        }

        return this.getStreamDetails(config.brandSlug);
      }

      const container = await docker.createContainer({
        Image: OwncastOrchestrator.DOCKER_IMAGE,
        name: containerName,
        Labels: {
          'traefik.enable': 'true',
          [`traefik.http.routers.${config.brandSlug}.rule`]: `Host(\`${config.brandSlug}.fashionboxe.com\`)`,
          [`traefik.http.services.${config.brandSlug}.loadbalancer.server.port`]: '8080',
        },
        ExposedPorts: {
          '8080/tcp': {}, // Web UI
          '1935/tcp': {}  // RTMP Stream
        },
        HostConfig: {
          PortBindings: {
            '8080/tcp': [{ HostPort: String(config.webPort) }],
            '1935/tcp': [{ HostPort: String(config.rtmpPort) }]
          },
          // Bind mount for persistent data (ensure this path exists on host)
          Binds: [`/home/fashionboxe/data/${config.brandId}:/app/data`],
          NetworkMode: 'fashionboxe-net',
          // Resource Limits for stability and scaling
          Memory: 512 * 1024 * 1024, // 512MB
          CpuQuota: 50000,           // 50% of 1 CPU core
          RestartPolicy: { Name: 'unless-stopped' }
        },
        NetworkingConfig: {
          EndpointsConfig: {
            'fashionboxe-net': {}
          }
        }
      });
      
      await container.start();
      console.log(`[ORCHESTRATOR] Successfully started container for ${config.brandSlug}`);

      return this.getStreamDetails(config.brandSlug);

    } catch (error) {
      console.error(`[ORCHESTRATOR] Failed to provision instance for ${config.brandSlug}:`, error);
      throw error;
    }
  }

  private getStreamDetails(brandSlug: string) {
      // In a real setup with Traefik/Caddy, this would be a subdomain.
      // For now, we assume the main proxy handles routing based on slug or port.
      const streamUrl = `https://live.fashionboxe.com/${brandSlug}`;
      return {
          streamUrl,
          streamKey: `fb_${brandSlug}_${Math.random().toString(36).substring(7)}`, // In reality, fetch from Owncast API
          rtmpEndpoint: `rtmp://live.fashionboxe.com/app`,
      };
  }

  async decommissionInstance(brandSlug: string) {
    console.log(`[ORCHESTRATOR] Decommissioning instance for ${brandSlug}...`);
    try {
        const containerName = `fashionboxe-store-${brandSlug}`;
        const containers = await docker.listContainers({ all: true, filters: { name: [containerName] } });
        
        if (containers.length > 0) {
            const container = docker.getContainer(containers[0].Id);
            await container.stop();
            await container.remove();
            console.log(`[ORCHESTRATOR] Removed container ${containerName}`);
        }
    } catch (error) {
        console.error(`[ORCHESTRATOR] Failed to decommission ${brandSlug}:`, error);
    }
  }

  async getInstanceStatus(brandSlug: string) {
    console.log(`[ORCHESTRATOR] Checking status for ${brandSlug}...`);
    try {
        const containerName = `fashionboxe-store-${brandSlug}`;
        const containers = await docker.listContainers({ all: true, filters: { name: [containerName] } });
        
        if (containers.length > 0 && containers[0].State === 'running') {
            return 'RUNNING';
        }
        return 'STOPPED';
    } catch (error) {
        console.error(`[ORCHESTRATOR] Error getting status for ${brandSlug}:`, error);
        return 'UNKNOWN';
    }
  }
}

export const orchestrator = new OwncastOrchestrator();
