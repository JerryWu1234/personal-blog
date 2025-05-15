import { $, component$,  } from "@qwik.dev/core";


export const DDD = component$(() => {
  const ddd = $(() => {
    console.log("ddd");
  })
  return (
    <div onClick$={ddd}>
      deb
     
    </div>
  );
});
