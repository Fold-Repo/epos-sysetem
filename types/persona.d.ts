declare module "persona" {
  interface PersonaClientOptions {
    clientToken?: string;
    templateId?: string;
    environmentId?: string;
    referenceId?: string;
    onReady?: () => void;
    onComplete?: (result: unknown) => void;
    onCancel?: (data: unknown) => void;
    onError?: (error: unknown) => void;
    onEvent?: (name: string, meta: unknown) => void;
  }

  interface PersonaClient {
    open: () => void;
    cancel: (force?: boolean) => void;
    destroy: () => void;
  }

  const Persona: {
    Client: new (options: PersonaClientOptions) => PersonaClient;
  };

  export default Persona;
}

