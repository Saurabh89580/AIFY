"use client";
import { formatDistanceToNow } from "date-fns";
import {
    EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credential-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Credential } from "@/generated/prisma/client";
import { CredentialType } from "@/generated/prisma";
import Image from "next/image";

export const CredentilasSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials"
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return(
    <EntityList
        items={credentials.data.items}
        getKey={(credential) => credential.id}
        renderItem={(credential)=><CredentialItem data={credential}/>}
        emptyView={<CredentialsEmpty/>}
    />
  )
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {

  return (
      <EntityHeader
        title="Credentials"
        description="create and manage your credentials"
        newButtonHref="/credentials/new"
        newButtonLabel="New credential"
        disabled={disabled}
    />
  );
};

export const CredentialsPagination = () => {
  const credentialss = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      disabled={credentialss.isFetching}
      totalPages={credentialss.data.totalPages}
      page={credentialss.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentilasSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials" />;
};

export const CredentialsError = () => {
  return <ErrorView message="Error loading credentials" />;
};  

export const CredentialsEmpty = () => {
    const router=useRouter();

    const handleCreate=()=>{
        router.push(`/credentials/new`);
        };

  return (
        <EmptyView
        onNew={handleCreate}
        message="You haven't created any credentials yet. 
        Get started by creating a new credential."
    />
  );
};

const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.OPENAI]:"/logos/openai.svg",
    [CredentialType.ANTHROPIC]:"/logos/anthropic.svg",
    [CredentialType.GEMINI]:"/logos/gemini.svg",
};

export const CredentialItem=({
  data,
}: {
  data:Credential
})=>{
    const removeCredential=useRemoveCredential();
    
    const handleRemove=()=>{
        removeCredential.mutate({id:data.id});
    };

  const logo = credentialLogos[data.type] || "/logos/openai.svg";

    return(
        <EntityItem
        href={`/credentials/${data.id}`}
        title={data.name}
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "}
            &bull; 
            Created {formatDistanceToNow(data.createdAt,{addSuffix:true})}{" "}
            </>
        }
        image={
            <div className="size-8 flex items-center justify-center">
            <Image
                src={logo}
                alt={data.type}
                width={32}
                height={32}
                className="object-contain"
            />
            </div>
        }
        onRemove={handleRemove}
        isRemoving={removeCredential.isPending}
        />
    )
}