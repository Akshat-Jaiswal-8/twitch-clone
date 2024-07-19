import React, { ElementRef, useRef, useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateStream } from "@/actions/stream";
import { Hint } from "@/components/hint";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import Image from "next/image";

interface InfoModalProps {
  initialName: string;
  initialThumbnailUrl: string | null;
}

const InfoModal = ({ initialName, initialThumbnailUrl }: InfoModalProps) => {
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);

  const [name, setName] = useState<string>(initialName);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    initialThumbnailUrl,
  );

  const onRemoveThumbnail = () => {
    startTransition(() => {
      updateStream({ thumbnailUrl: null })
        .then(() => {
          closeRef.current?.click();
          toast.success("Thumbnail removed");
        })
        .catch(() => {
          toast.error("something went wrong");
        });
    });
  };

  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      updateStream({ name })
        .then(() => {
          closeRef?.current?.click();
          toast.success("Stream updated");
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"} size={"sm"} className={"ml-auto"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit your stream info</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className={"space-y-14"}>
          <div className={"space-y-2"}>
            <Label>Name</Label>
            <Input
              placeholder={"Stream Name"}
              onChange={onChange}
              value={name}
              disabled={isPending}
            />
          </div>
          <div>
            <Label>Thumbnail</Label>
            {thumbnailUrl ? (
              <div
                className={
                  "relative aspect-video rounded-xl overflow-hidden border border-white/10"
                }
              >
                <div className={"absolute top-2 right-2 z-[10]"}>
                  <Hint label={"remove thumbnail"} asChild side={"left"}>
                    <Button
                      type={"button"}
                      disabled={isPending}
                      onClick={onRemoveThumbnail}
                      className={"h-auto w-auto p-1.5"}
                    >
                      <Trash className={"h-4 w-4"} />
                    </Button>
                  </Hint>
                </div>
                <Image
                  src={thumbnailUrl}
                  alt={"Thumbnail"}
                  fill
                  className={"object-cover"}
                />
                thumbnailUrl
              </div>
            ) : (
              <div className={"rounded-xl border outline-dashed outline-muted"}>
                <UploadDropzone
                  endpoint={"thumbnailUploader"}
                  appearance={{
                    label: {
                      color: "#FFFFFF",
                    },
                    allowedContent: {
                      color: "#FFFFFF",
                    },
                  }}
                  onClientUploadComplete={(res) => {
                    setThumbnailUrl(res?.[0]?.url);
                    router.refresh();
                    closeRef.current?.click();
                  }}
                />
              </div>
            )}
          </div>
          <div className={"flex justify-between"}>
            <DialogClose ref={closeRef} asChild>
              <Button type={"button"} variant={"ghost"}>
                Cancel
              </Button>
            </DialogClose>
            <Button variant="default" type={"submit"} disabled={isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
