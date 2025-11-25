"use client";   

import {zodResolver} from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {useForm} from "react-hook-form";
import {z} from "zod";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import { Form,FormControl,FormField,FormItem,FormLabel,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const loginSchema=z.object({
    email:z.email("Invalid email address"),
    password:z.string().min(6,"Password must be at least 6 characters"),
}); 

type LoginFormValues=z.infer<typeof loginSchema>;

export function LoginForm(){
    const router=useRouter();
    const form=useForm<LoginFormValues>({
        resolver:zodResolver(loginSchema),
        defaultValues:{
            email:"",
            password:"",
        },
    })
    const onSubmit=async(values:LoginFormValues)=>{
         await authClient.signIn.email(
            {
                email:values.email,
                password:values.password,
                callbackURL:"/"
            },
            {
                onSuccess: ()=>{
                    router.push("/");
                },
                onError: (error)=>{
                    toast.error("Something went wrong");
                }
            }
        )
    };

    const isPending=form.formState.isSubmitting;
    return (
        <div className="">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>
                        <h1 className={cn("text-2xl font-semibold","mb-4")}>Login</h1>
                    </CardTitle>
                    <CardDescription>
                        Login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                                    <Image src="/logos/github.svg" alt="GitHub logo" width={20} height={20} />
                                    continue with github
                                </Button>
                                <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                                    <Image src="/logos/google.svg" alt="Google logo" width={20} height={20} />
                                    continue with google
                                </Button>
                                </div>
                                <div className="grid gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field})=>(    
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="name@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <FormField
                                        control={form.control}
                                        name="password"
                                        render={({field})=>(    
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="Your password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <Button type="submit" disabled={isPending}>Login</Button>
                            
                                </div>
                                <div className="text-center text-sm">Don't have an account? 
                                    <Link href="/signup" className="text-blue-600 hover:underline m-1">Sign up</Link>
                                </div>
                            </div>
                        </form>
                    </Form>       
                </CardContent>
            </Card>
        </div>
    );
};