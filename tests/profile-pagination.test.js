import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, statSync } from "node:fs";
import { paginateProfiles, DEPUTIES_PAGE_SIZE, COUNCILLORS_PAGE_SIZE } from "../src/utils/profilePagination.js";

// Data modules contain only objects and asset imports, not JSX. Replace asset
// imports with file URLs so these tests do not need a browser or a Vite server.
async function readDataModule(path) {
  const file = new URL(path, import.meta.url);
  const source = readFileSync(file, "utf8").replace(
    /import (\w+) from ["']([^"']+)["'];?/g,
    (_, name, asset) => `const ${name} = ${JSON.stringify(new URL(asset, file).href)};`,
  );
  return import(`data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`);
}

const { concejalesData } = await readDataModule("../src/data/representantes.jsx");
const { diputadosData } = await readDataModule("../src/data/diputadosData.jsx");
const { profileImages } = await readDataModule("../src/data/profileImages.js");

test("se muestran como máximo ocho concejales y seis diputados por página", () => {
  assert.equal(paginateProfiles(concejalesData, 1, COUNCILLORS_PAGE_SIZE).items.length, 8);
  assert.equal(paginateProfiles(diputadosData, 1, DEPUTIES_PAGE_SIZE).items.length, 6);
});

test("todas las personas se conservan en orden, sin duplicados ni omisiones", () => {
  for (const [data, size] of [[concejalesData, COUNCILLORS_PAGE_SIZE], [diputadosData, DEPUTIES_PAGE_SIZE]]) {
    const pages = paginateProfiles(data, 1, size).pageCount;
    const collected = Array.from({ length: pages }, (_, i) => paginateProfiles(data, i + 1, size).items).flat();
    assert.deepEqual(collected, data);
    assert.equal(new Set(collected.map(({ id }) => id)).size, data.length);
  }
});

test("el filtro de ciudad opera sobre todo el conjunto, no solo la página visible", () => {
  const city = concejalesData.at(-1).ciudad;
  const filtered = concejalesData.filter(({ ciudad }) => ciudad === city);
  const result = paginateProfiles(filtered, 1, COUNCILLORS_PAGE_SIZE);
  assert.ok(result.items.some(({ id }) => id === concejalesData.at(-1).id));
  assert.ok(result.items.every(({ ciudad }) => ciudad === city));
  assert.equal(result.page, 1);
});

test("un cambio de filtro no puede dejar una página fuera del rango", () => {
  const result = paginateProfiles(concejalesData.slice(0, 3), 3, COUNCILLORS_PAGE_SIZE);
  assert.equal(result.page, 1);
  assert.equal(result.pageCount, 1);
  assert.equal(result.items.length, 3);
});

test("las páginas incompletas y los listados vacíos calculan bien sus límites", () => {
  const last = paginateProfiles(concejalesData, 99, COUNCILLORS_PAGE_SIZE);
  assert.equal(last.to, concejalesData.length);
  assert.equal(last.items.length, last.to - last.from + 1);
  assert.deepEqual(paginateProfiles([], 4, 8), { page: 1, pageCount: 1, items: [], total: 0, from: 0, to: 0 });
});

test("los números de página inválidos no rompen el listado", () => {
  for (const value of [0, -1, NaN, undefined]) {
    assert.equal(paginateProfiles(concejalesData, value, 8).page, 1);
  }
  for (const value of [0, -1, 1.5, NaN]) {
    assert.throws(() => paginateProfiles(concejalesData, 1, value), RangeError);
  }
});

test("cada perfil tiene imágenes existentes y miniaturas con dimensiones limitadas", () => {
  for (const person of [...concejalesData, ...diputadosData]) {
    const image = profileImages[person.foto];
    assert.ok(image, `Falta optimización para ${person.nombre}`);
    assert.ok(image.width <= 960);
    assert.ok(image.width * image.height < 1_700_000);
    for (const asset of [image.card, image.modal]) assert.ok(statSync(new URL(asset)).size > 0);
    if (image.srcSet) {
      const candidates = image.srcSet.split(", ");
      assert.equal(candidates.length, 2);
      assert.match(candidates[0], / 480w$/);
      assert.ok(statSync(new URL(candidates[0].split(" ")[0])).size < statSync(new URL(image.card)).size);
    }
  }
});

test("las versiones mayores de tarjetas reducen más del 70 % del peso total", () => {
  let original = 0;
  let optimized = 0;
  for (const person of [...concejalesData, ...diputadosData]) {
    original += statSync(new URL(person.foto)).size;
    optimized += statSync(new URL(profileImages[person.foto].card)).size;
  }
  assert.ok(optimized / original < 0.3, `${optimized} / ${original}`);
});

test("la tarjeta de concejal muestra ciudad entre nombre y perfil; la de diputado no", () => {
  const representatives = readFileSync(new URL("../src/components/SeccionRepresentantes.jsx", import.meta.url), "utf8").split("const ModalConcejal")[0];
  const deputies = readFileSync(new URL("../src/components/SeccionDiputados.jsx", import.meta.url), "utf8").split("const ModalDiputado")[0];
  assert.match(representatives, /\{concejal.nombre\}[\s\S]+\{concejal.ciudad\}[\s\S]+Ver perfil completo/);
  assert.doesNotMatch(deputies, /diputado.ciudad/);
});
