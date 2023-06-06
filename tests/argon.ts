import argon2 from "argon2";

(async () => {
  let password = "secret";
  let wrongPassword = "notSecret";
  let hash = await argon2.hash(password);

  console.log(hash);

  console.log(await argon2.verify(hash, password));
  console.log(await argon2.verify(hash, wrongPassword));
})();
