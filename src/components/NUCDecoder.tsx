import React, { useState } from 'react';
import { Copy, Key, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { DecodedNucToken, NucToken, NucTokenEnvelope, Codec } from '@nillion/nuc';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

enum NucTokenType {
  ACTIVE = 'ACTIVE',
  CHAINED = 'CHAINED'
}

// TEST
// const ether_token = "eyJ0eXAiOiJudWMiLCJhbGciOiJFUzI1NksiLCJ2ZXIiOiIxLjAuMCJ9.eyJpc3MiOiJkaWQ6ZXRocjoweDRmMzcxZDY4MjVDN0QzMDg0MUFiQjA1MDgyOGExMUJmOURmNTlGYWMiLCJhdWQiOiJkaWQ6bmlsOjAyZTZkNDBlNWI2ZWFhYzQ4MWQ4ZTIzMWE0NmU0N2RmYmVmNWI5MGRkNGExNDg1NThiMGNlZDI1YzVjMGJmMjU3MiIsInN1YiI6ImRpZDpldGhyOjB4NGYzNzFkNjgyNUM3RDMwODQxQWJCMDUwODI4YTExQmY5RGY1OUZhYyIsImNtZCI6Ii9uaWwvZGIvZGF0YS9maW5kIiwicG9sIjpbXSwibm9uY2UiOiIxNDM4YTYyMjhjMTg4Y2Q5NDFjM2NlN2VkMjgwZWVmNiIsInByZiI6WyIxODU3NzI4NTdiZTMwZDA4Yjk3NmFiYzA2NjUwZDhlZjIyMGEyYWUzZjRmYTljMTNjMDhjNGU5OGE4MDJkMmM1Il19.B799cP9jyX3KzfcIbr9b7qsWozDrXhZ1-B_o61yB8T4PZAqS4weIyg-PYuCIdNg3aSqbDVw09OBuDW46z0au-w";
// const key_token = "eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOjAyZTZkNDBlNWI2ZWFhYzQ4MWQ4ZTIzMWE0NmU0N2RmYmVmNWI5MGRkNGExNDg1NThiMGNlZDI1YzVjMGJmMjU3MiIsImF1ZCI6ImRpZDprZXk6elEzc2hwR1ZlaXpBa0JSb1ZHYjV6NzFUeUQ3OGd4bkxmc3JjblJ1NzFwdWdHUkZrayIsInN1YiI6ImRpZDpldGhyOjB4NGYzNzFkNjgyNUM3RDMwODQxQWJCMDUwODI4YTExQmY5RGY1OUZhYyIsImNtZCI6Ii9uaWwvZGIvZGF0YS9maW5kIiwiYXJncyI6eyJpZCI6MTIzfSwibm9uY2UiOiIwNmU1MzdiZDhlOGMxNTE5NmI3N2I1ZmZjZjdjOWViOSIsInByZiI6WyI4YTM5OTE2OGMzYzhjZGQ4YzY3NTUwNmI5OGE5YTUwNGJiZTk4ZmYxOTFiYzljMTRhMTlhZWUwM2ZhYTEwNTdkIl19.B799cP9jyX3KzfcIbr9b7qsWozDrXhZ1-B_o61yB8T4PZAqS4weIyg-PYuCIdNg3aSqbDVw09OBuDW46z0au-w";
// const chained_token = "eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOjAzMDdjNTUzODcyMGJlZGY4NmU5MjZlMTBmMmM1YjczYjExZTFiYmUzMzVjOWJiODJlOGQ2YzkyYjYyYjYyNmFhMiIsImF1ZCI6ImRpZDprZXk6elEzc2h1TjFwQ2VLSnJqSnJGRzdwUUc1MlQ5TlByY2hxVGRWRTlkQ2dMZ3ppWThKTiIsInN1YiI6ImRpZDpldGhyOjB4N2RlNTc2NTZhOENkN0I0YTJCZkQ4OGI3OTJEOWRDMDI1QzNlOGVGQiIsImNtZCI6Ii9uaWwvZGIvZGF0YS9maW5kIiwiYXJncyI6eyJpZCI6MTIzfSwibm9uY2UiOiI3OTIzMzA2ZTRlM2YwYmQxNDU1M2YxYTdkNTU2NWM1YyIsInByZiI6WyJjMWUyM2Q3MWIyODM2NDM0ZmYyODIzZjA3NzczYTViODBmNmFkOGI5MjVkMTI5YzlmYjUxNzQ4NWI3MDI1YWMzIl19.J4X3Ilhlhi_hYS1t_YqLCoF3_72Qzb6h1XgW5cl5CLhlvxumJ4ABnb7a-_HHhwVTwGzceLtmIwK-JxgdhQhBfQ/eyJ0eXAiOiJudWMiLCJhbGciOiJFUzI1NksiLCJ2ZXIiOiIxLjAuMCJ9.eyJpc3MiOiJkaWQ6ZXRocjoweDdkZTU3NjU2YThDZDdCNGEyQmZEODhiNzkyRDlkQzAyNUMzZThlRkIiLCJhdWQiOiJkaWQ6bmlsOjAzMDdjNTUzODcyMGJlZGY4NmU5MjZlMTBmMmM1YjczYjExZTFiYmUzMzVjOWJiODJlOGQ2YzkyYjYyYjYyNmFhMiIsInN1YiI6ImRpZDpldGhyOjB4N2RlNTc2NTZhOENkN0I0YTJCZkQ4OGI3OTJEOWRDMDI1QzNlOGVGQiIsImNtZCI6Ii9uaWwvZGIvZGF0YS9maW5kIiwicG9sIjpbXSwibm9uY2UiOiI5YTcyNDk2M2RhZTRjZTEzYjVmYzJiMzc1Y2U0YWI5OSIsInByZiI6WyJkMjM3NmY4Yjk1NWRjM2ZlZmY4MTVmNGZjY2QyNDg3YzAwNGY4YTE3NjM2MzMyOGY3N2YyYTdmMjIwMzRmNTgzIl19.5ZSTtOYiRNXYM0rqKKi9gCow8RM4jcLqEdsr43yRyXRZ7zhL1zAw-AYNv3TjVsOyWPHSLrpQi383zJAHm-kf7hw/eyJ0eXAiOiJudWMiLCJhbGciOiJFUzI1NksiLCJ2ZXIiOiIxLjAuMCJ9.eyJpc3MiOiJkaWQ6a2V5OnpRM3NocEF1MXBIMmJUUmRMTWtqekR6a0s2elN3WDRjRlk4N3hKRFhOOWVudnNmaTQiLCJhdWQiOiJkaWQ6ZXRocjoweDdkZTU3NjU2YThDZDdCNGEyQmZEODhiNzkyRDlkQzAyNUMzZThlRkIiLCJzdWIiOiJkaWQ6ZXRocjoweDdkZTU3NjU2YThDZDdCNGEyQmZEODhiNzkyRDlkQzAyNUMzZThlRkIiLCJjbWQiOiIvbmlsL2RiL2RhdGEiLCJwb2wiOltdLCJub25jZSI6ImRhZDUyNzY5MjYzZGU1MjZjOTFkMWMyMTljNzE2NmVjIiwicHJmIjpbXX0.9ysRInYpfXij5zqAtthptO_Gs4nYcqfrhEimzy6mfVw6DzAr-U1ugvIjAEY1O2Jd9GWSIQehIp0Zdo6zfyEUyg"
// //

type PolicyArray = [string, string, number | string];

interface TokenChainItem {
  id: string;
  type: string;
  nuc?: string;
  decoded?: DecodedNucToken;
  alias: string;
  isActive: boolean;
}

const aliases: Record<string, string> = {};

const NUCDecoder: React.FC = () => {
  const navigate = useNavigate();
  const [nuc, setNUC] = useState('');
  const [decodedNUC, setDecodedNUC] = useState<NucTokenEnvelope | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(true);
  const [selectedToken, setSelectedToken] = useState<TokenChainItem>();
  const [tokenChain, setTokenChain] = useState<TokenChainItem[]>([]);

  const createIdentityAliases = (nucEnvelope: NucTokenEnvelope) => {
    let i = 0;
    nucEnvelope.proofs.reverse().forEach((proof) => {
      const issuer = proof.payload.iss.didString;
      const audience = proof.payload.aud.didString;
      const subject = proof.payload.sub.didString;
      if (!aliases[issuer]) {
        aliases[issuer] = `DID-${i + 1}`;
        i++;
      }
      
      if (!aliases[audience]) {
        aliases[audience] = `DID-${i + 1}`;
        i++;
      }
      
      if (!aliases[subject]) {
        aliases[subject] = `DID-${i + 1}`;
        i++;
      }
    });
    const tokenIssuer = nucEnvelope.nuc.payload.iss.didString;
    const tokenAudience = nucEnvelope.nuc.payload.aud.didString;
    const tokenSubject = nucEnvelope.nuc.payload.sub.didString;
    if (!aliases[tokenIssuer]) {
        aliases[tokenIssuer] = `DID-${i + 1}`;
    }
    if (!aliases[tokenAudience]) {
        aliases[tokenAudience] = `DID-${i + 1}`;
    }
    if (!aliases[tokenSubject]) {
        aliases[tokenSubject] = `DID-${i + 1}`;
    }
  };
  
  // Convert Uint8Array(64) to hex string for display
  const signatureHex = (signature: Uint8Array) => Array.from(signature)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  const decodeNUC = async () => {
    setError(null);
    setDecodedNUC(null);

    if (!nuc.trim()) {
      setError('Please enter a NUC token');
      return;
    }

    try {
      // eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOjAzZWNjODljNjRmODU2NjhlN2Q3Y2EyMjhkZjEwMzQxYjc1Zjg4NzVjZjBmMDAzMmNiOTlkMjI1ZGEwZmQyNTUwOSIsImF1ZCI6ImRpZDpuaWw6YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhIiwic3ViIjoiZGlkOm5pbDowMzE0ZGI4ZDRkMzQxMDFiYTgwMTc0YjkzN2ZhMGE5MDAzNDlmNTEzZjZkNjMwOTc4MWUwMTViZDg1YzkzZTAwMDAiLCJjbWQiOiIvbmlsL2Jhci9mb28iLCJhcmdzIjp7ImJhciI6MTMzNywiZm9vIjo0Mn0sIm5vbmNlIjoiZjZjODQ1ZTgyM2NmOWYxZTQwM2M2ZWQzYTRjYWI5MzkiLCJwcmYiOlsiZmQ2ZDQzNzE5ZGFlYjI1NjdkNThkM2JiYWFkMDViMjk3NTkyYzRhZmJmZDA0MjdiNGJkZTU2YjVjZDIyODI4OCJdfQ.HFbkOcpS61YBtLCRJY4dwANC79P0GZzzHPK7z016iz0hwCTyQ56-3esjkFPOtdDkgzhNQB1Rc6-kclaC84FmKA
      const t = nuc.trim();
      // eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOjAzZWNjODljNjRmODU2NjhlN2Q3Y2EyMjhkZjEwMzQxYjc1Zjg4NzVjZjBmMDAzMmNiOTlkMjI1ZGEwZmQyNTUwOSIsImF1ZCI6ImRpZDpuaWw6YWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhIiwic3ViIjoiZGlkOm5pbDowMzE0ZGI4ZDRkMzQxMDFiYTgwMTc0YjkzN2ZhMGE5MDAzNDlmNTEzZjZkNjMwOTc4MWUwMTViZDg1YzkzZTAwMDAiLCJjbWQiOiIvbmlsL2Jhci9mb28iLCJhcmdzIjp7ImJhciI6MTMzNywiZm9vIjo0Mn0sIm5vbmNlIjoiZjZjODQ1ZTgyM2NmOWYxZTQwM2M2ZWQzYTRjYWI5MzkiLCJwcmYiOlsiZmQ2ZDQzNzE5ZGFlYjI1NjdkNThkM2JiYWFkMDViMjk3NTkyYzRhZmJmZDA0MjdiNGJkZTU2YjVjZDIyODI4OCJdfQ.HFbkOcpS61YBtLCRJY4dwANC79P0GZzzHPK7z016iz0hwCTyQ56-3esjkFPOtdDkgzhNQB1Rc6-kclaC84FmKA/eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOjAzMTRkYjhkNGQzNDEwMWJhODAxNzRiOTM3ZmEwYTkwMDM0OWY1MTNmNmQ2MzA5NzgxZTAxNWJkODVjOTNlMDAwMCIsImF1ZCI6ImRpZDpuaWw6MDNlY2M4OWM2NGY4NTY2OGU3ZDdjYTIyOGRmMTAzNDFiNzVmODg3NWNmMGYwMDMyY2I5OWQyMjVkYTBmZDI1NTA5Iiwic3ViIjoiZGlkOm5pbDowMzE0ZGI4ZDRkMzQxMDFiYTgwMTc0YjkzN2ZhMGE5MDAzNDlmNTEzZjZkNjMwOTc4MWUwMTViZDg1YzkzZTAwMDAiLCJjbWQiOiIvbmlsL2JhciIsInBvbCI6W1siPT0iLCIuYXJncy5iYXIiLDEzMzddXSwibm9uY2UiOiJjODk4OTE3NzYzODE5OGQ2MmMxZDE0NGU0OWFhY2IzNyIsInByZiI6WyIzM2Y4OWUyOWUzZjFlZGQ1YzY1ZTNmNjY0NzVhNDg3MjVhOTA5NzcyY2I0ZTQ3ZjRlMjMxYWE4OGE3MTE4Y2ZjIl19.KKDipMYKidTm8GjrYCk2IRbJaVoc-kbJruxI4mPD_N4LqnXJIEv0TbDrl2fMOnxPvxGS9Aep6MEf4Zlauds1OA/eyJhbGciOiJFUzI1NksifQ.eyJpc3MiOiJkaWQ6bmlsOjAyMGJkMzlhZjEwMjNlN2M3ZGQwMGM4N2QwYjg1OTAyMjEyMmU0NzVhMzJhMjI0ZmNjODNmMmRlMThkODcyZWQ1NyIsImF1ZCI6ImRpZDpuaWw6MDMxNGRiOGQ0ZDM0MTAxYmE4MDE3NGI5MzdmYTBhOTAwMzQ5ZjUxM2Y2ZDYzMDk3ODFlMDE1YmQ4NWM5M2UwMDAwIiwic3ViIjoiZGlkOm5pbDowMzE0ZGI4ZDRkMzQxMDFiYTgwMTc0YjkzN2ZhMGE5MDAzNDlmNTEzZjZkNjMwOTc4MWUwMTViZDg1YzkzZTAwMDAiLCJjbWQiOiIvbmlsIiwicG9sIjpbWyI9PSIsIi5hcmdzLmZvbyIsNDJdLFsiPT0iLCIkLnJlcS5iYXIiLDEzMzddXSwibm9uY2UiOiJkMzcwODM3NTZhMzAzZjk0NjZjNWRmZjhmODRhYzM4YSIsInByZiI6W119.VP2yIlY6rad9diKrIX2_Q4K7tUpJAxLA1j-MdTG9jd5tHavOH2Zk31BVEv-3GNHoSulvbVw7ipVXgB70TlXU0A
      // eyJ0eXAiOiJudWMiLCJhbGciOiJFUzI1NksiLCJ2ZXIiOiIxLjAuMCJ9eyJpc3MiOiJkaWQ6a2V5OnpRM3NoYXFHWEUyUUdEczhxaXZLZURGY0JQdkQyYUc4VUF2Z0tFZFVqalhtNTZVTkgiLCJhdWQiOiJkaWQ6a2V5OjAyZTM4NDZjNDU1ZGJjZWVmOWVmZjhhODQxMjdjM2JlMWI5NzE5YWMwNTQxNWVmYmY3Mjc5MGYzMWZhOWY4MDI3YSIsInN1YiI6ImRpZDprZXk6elEzc2hUZTN0Y2JVQkRaRUJHalZlY25TUGM0Qkxad25wR3pkcjRIVTYzVEp0VHRTeiIsImNtZCI6Ii9uaWwvZGIvZGF0YS9yZWFkIiwiYXJncyI6eyJkb2N1bWVudCI6IjZlNmE2NTA5LTIzNGMtNGJlYi04MmQ2LTc4YTUxYzE3MTRiMCIsImNvbGxlY3Rpb24iOiJmN2IzNTk4OS1iNzIwLTQ5NzktYTJhNS1kOTgzNDg1YjUxZjIifSwiZXhwIjoxNzY1MDE2OTgwMzg0LCJub25jZSI6ImY5ODA3MjlhYjkyMTQwNTAxYmNjODYzYmYzMTM1MGJmIiwicHJmIjpbIjI4OTBlMDE3ZTkyODFlZDgwZjBjMjczNjI3NGVhMzVlZWZlODI3OGM4NTM5ZThhZTMyZWZiN2U0NzgyZDRhMzkiXX0XRuoMNNDnMdBh22LIIEMJUg8tRcOapnBqJaJK2g2bhMeHaNn5cNLfK1MuHGqPnBKD4BR4Wl1ZnhFDDMpIkGQ/eyJ0eXAiOiJudWMiLCJhbGciOiJFUzI1NksiLCJ2ZXIiOiIxLjAuMCJ9eyJpc3MiOiJkaWQ6a2V5OnpRM3NoVGUzdGNiVUJEWkVCR2pWZWNuU1BjNEJMWnducEd6ZHI0SFU2M1RKdFR0U3oiLCJhdWQiOiJkaWQ6a2V5OnpRM3NoYXFHWEUyUUdEczhxaXZLZURGY0JQdkQyYUc4VUF2Z0tFZFVqalhtNTZVTkgiLCJzdWIiOiJkaWQ6a2V5OnpRM3NoVGUzdGNiVUJEWkVCR2pWZWNuU1BjNEJMWnducEd6ZHI0SFU2M1RKdFR0U3oiLCJjbWQiOiIvbmlsL2RiL2RhdGEvcmVhZCIsInBvbCI6W1siPT0iLCIucGF5bG9hZC5ib2R5LmRvY3VtZW50IiwiNmU2YTY1MDktMjM0Yy00YmViLTgyZDYtNzhhNTFjMTcxNGIwIl0sWyI9PSIsIi5wYXlsb2FkLmJvZHkuY29sbGVjdGlvbiIsImY3YjM1OTg5LWI3MjAtNDk3OS1hMmE1LWQ5ODM0ODViNTFmMiJdXSwiZXhwIjoxNzY1MDE2OTgwMzgxLCJub25jZSI6Ijg0MDkwMjQ0Y2Q3NjVjYTU0ZTE0YWIzOWQyYTM3ZmE4IiwicHJmIjpbImY3Y2VjYjQ1NmFkYjVkZDQ3ZDdhZWM2MTliYTlmODVkMmRmMDAwNzliODc3ZTMxOGQzNjUwOTU5MTJmNDhlY2QiXX003uvkuMXt3sFPBRLbVxZUg7JVFYaVjOOkj1IGkHPJ0NHCIVDEqf94u2wHiObugRyBBDvGQwvMoSRQ1TQme4Q/eyJ0eXAiOiJudWMiLCJhbGciOiJFUzI1NksiLCJ2ZXIiOiIxLjAuMCJ9eyJpc3MiOiJkaWQ6a2V5OnpRM3NodXk0SENra1R4UHNodG5yQlFyak5maks4cUM0VHZlakp6NTlDRmt5cHRNNkgiLCJhdWQiOiJkaWQ6a2V5OnpRM3NoVGUzdGNiVUJEWkVCR2pWZWNuU1BjNEJMWnducEd6ZHI0SFU2M1RKdFR0U3oiLCJzdWIiOiJkaWQ6a2V5OnpRM3NoVGUzdGNiVUJEWkVCR2pWZWNuU1BjNEJMWnducEd6ZHI0SFU2M1RKdFR0U3oiLCJleHAiOjE3NjY0MTk1MTksImNtZCI6Ii9uaWwvZGIiLCJwb2wiOltdLCJub25jZSI6IjVmMGZlZmFiODBiZDc5ZmQ0OTk0OTU5MmRmNzAzYTFmIiwicHJmIjpbXX0w6Ef0CCd59z5AX3lNjuetZR0Bh8PRIpZsDyNQNQU36hcEDwWm0nOH9Rm6K6fTjpdCvxz5jhagDsTjSqLug1Q=
      // 28a0e2a4c60a89d4e6f068eb6029362116c9695a1cfa46c9aeec48e263c3fcde0baa75c9204bf44db0eb9767cc3a7c4fbf1192f407a9e8c11fe1995ab9db3538
      const decodedNuc = Codec._unsafeDecodeBase64Url(t);

      createIdentityAliases(decodedNuc);

      setDecodedNUC(decodedNuc);
      
      const tokenChain: TokenChainItem[] = decodedNuc.proofs.map((proof, idx) => {
         return {
          id: `chained_token_${idx + 1}`,
          type: NucTokenType.CHAINED,
          alias: `CHAINED-TOKEN-${idx + 1}`,
          isActive: false,
          decoded: proof
         }
      });

      tokenChain.push({
          id: 'end_of_chain_token',
          type: NucTokenType.ACTIVE,
          alias: `TOKEN`,
          isActive: true,
          decoded: decodedNuc.nuc
      });
      
      // Update the current token in the chain
      setTokenChain(tokenChain);

      setSelectedToken(tokenChain[tokenChain.length - 1]);
      
      setShowInput(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode NUC');
    }
  };

  const resetDecoder = () => {
    setNUC('');
    setDecodedNUC(null);
    setError(null);
    setCopied(null);
    setShowInput(true);
    setSelectedToken(undefined);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'from-emerald-400 to-blue-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusIndicatorColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-400';
      default: return 'bg-gray-400';
    }
  };

  const renderJSONSection = (data: any, type: string) => {

    const jsonString = JSON.stringify(data, null, 2);
    
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Payload</h3>
          <button
            onClick={() => copyToClipboard(jsonString, type)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            {copied === type ? <CheckCircle size={16} /> : <Copy size={16} />}
            {copied === type ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="bg-gray-50/90 p-4 rounded-lg border border-gray-200/50 text-sm overflow-x-auto text-gray-700 font-mono shadow-inner">
          {jsonString}
        </pre>
        
        <div className="mt-4 space-y-3 p-4 bg-blue-50/50 rounded-lg border border-blue-200/30">
          {data.exp && (
            <div className="text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="font-semibold text-gray-700">Expires:</span>
              <span className="text-gray-800 font-mono">{formatTimestamp(data.exp)}</span>
            </div>
          )}
          {data.iat && (
            <div className="text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-gray-700">Issued At:</span>
              <span className="text-gray-800 font-mono">{formatTimestamp(data.iat)}</span>
            </div>
          )}
          {data.nbf && (
            <div className="text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="font-semibold text-gray-700">Not Before:</span>
              <span className="text-gray-800 font-mono">{formatTimestamp(data.nbf)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-500 to-indigo-600 py-12 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 focus:ring-4 focus:ring-white/30 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20 transform hover:scale-105"
          >
            <ArrowLeft size={18} />
            Back 
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black/60 backdrop-blur-sm rounded-full mb-6">
            <img 
              src="/nillion-tools-logo.png" 
              alt="Logo" 
              className="logo"
            />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">NUC Viewer</h1>
          <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
            Decode and inspect NUC Tokens instantly.
          </p>
        </div>

        {showInput && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
            <div className="mb-8">
              <label htmlFor="nuc-input" className="block text-lg font-semibold text-gray-800 mb-3">
                NUC Token
              </label>
              <textarea
                id="nuc-input"
                value={nuc}
                onChange={(e) => setNUC(e.target.value)}
                placeholder="Paste your NUC token here..."
                className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 resize-none font-mono text-sm shadow-inner bg-gray-50/50"
              />
            </div>

            <button
              onClick={decodeNUC}
              disabled={!nuc.trim()}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              Decode NUC
            </button>

            {error && (
              <div className="mt-6 p-6 bg-red-50/90 backdrop-blur-sm border-2 border-red-200 rounded-xl flex items-start gap-4 shadow-lg">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-800 text-lg">Error</h4>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {decodedNUC && (
          <div className="mb-8">
            {/* NUC Chain Visualization */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Token Chain</h2>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {tokenChain.map((token, index) => (
                  <React.Fragment key={token.id}>
                    {/* Token Box */}
                    <div className="flex flex-col items-center">
                        <button
                        onClick={() => setSelectedToken(token)}
                        className={`relative rounded-lg border-2 flex items-center justify-center mb-2 shadow-xl transition-all duration-300 transform hover:scale-105 ${
                          selectedToken?.id === token.id
                          ? `w-32 h-24 bg-gradient-to-br ${getStatusColor(token.type)} border-white/70 scale-110`
                          : selectedToken?.type === NucTokenType.CHAINED
                          ? `w-28 h-20 bg-gradient-to-br ${getStatusColor(token.type)} border-white/50`
                          : 'w-24 h-16 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30'
                        }`}
                        >
                        {token.decoded?.payload?.iss.method === "ethr" ? (
                          <img
                          src="/ethereum-eth-logo.svg"
                          alt="Key issuer"
                          className="w-6 h-6"
                          />
                        ) : (
                          <Key className="w-8 h-8 text-white" />
                        )}
                        
                        <div className={`absolute -top-1 -right-1 w-4 h-4 ${getStatusIndicatorColor(token.type)} rounded-full border-2 border-white animate-pulse` }></div>
                        </button>
                      <span className={`text-sm font-medium mb-1 ${
                        selectedToken?.type === NucTokenType.CHAINED ? 'text-white font-bold' : 'text-white/70'
                      }`}>
                        Issued by 
                        <span data-tooltip-id="did-tooltip" data-tooltip-content={token.decoded?.payload.iss.didString} data-tooltip-place="top">{aliases[token.decoded?.payload.iss.didString!]}</span>
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        token.type === NucTokenType.CHAINED ? 'bg-gray-500/20 text-gray-200' : 'bg-green-500/20 text-green-200'
                      }`}>
                        {token.alias}
                      </span>
                    </div>
                    
                    {/* Connection Line */}
                    {index < tokenChain.length - 1 && (
                      <div className="flex items-center -mt-12">
                        <div className="w-8 h-0.5 bg-gradient-to-r from-white/30 to-white/60"></div>
                        <div className="w-2 h-2 bg-white/60 rounded-full mx-1"></div>
                        <div className="w-8 h-0.5 bg-gradient-to-r from-white/60 to-white/30"></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-white/80 text-sm mb-2">
                  Click on any token to view its details below
                </p>
                <p className="text-white/60 text-xs">
                  NUCs tokens are often part of a chain in authentication flows, where each token references or leads to the next
                </p>
              </div>
            </div>

            { selectedToken && (
            <div className="mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Viewing token: { selectedToken?.alias }
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${getStatusIndicatorColor(selectedToken?.type || '')} rounded-full`}></div>
                  <span className="text-white/80 text-xl">
                    Issued by 
                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 mx-3 font-medium text-indigo-700 ring-1 ring-indigo-600/20 ring-inset" data-tooltip-id="did-tooltip" data-tooltip-content={selectedToken?.decoded?.payload.iss.didString!} data-tooltip-place="top">{aliases[selectedToken?.decoded?.payload.iss.didString!]}</span> 
                    to <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 mx-3 font-medium text-green-700 ring-1 ring-green-600/20 ring-inset" data-tooltip-id="did-tooltip" data-tooltip-content={selectedToken?.decoded?.payload.aud.didString} data-tooltip-place="top">{aliases[selectedToken?.decoded?.payload.aud.didString!]}</span> 
                    to perform  
                    <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 mx-3 font-medium text-purple-700 ring-1 ring-purple-600/20 ring-inset">{selectedToken?.decoded?.payload.cmd!}</span>
                    on 
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 mx-3 font-medium text-yellow-700 ring-1 ring-yellow-600/20 ring-inset" data-tooltip-id="did-tooltip" data-tooltip-content={selectedToken?.decoded?.payload.sub.didString} data-tooltip-place="top">{aliases[selectedToken?.decoded?.payload.sub.didString!]}</span>
                    { selectedToken.decoded?.payload.pol && selectedToken.decoded?.payload.pol.length > 0 && (
                      <div className="mt-2">
                      with arguments
                        <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 mx-3 font-medium text-pink-700 ring-1 ring-pink-600/20 ring-inset text-sm">
                        { 
                          (() => {
                            const pol = selectedToken.decoded?.payload.pol;
                            if (Array.isArray(pol)) {
                              return pol.map(([operator, path, value]: PolicyArray) => `${path} ${operator} ${value}`).join(', ');
                            }
                            return typeof pol === 'string' || typeof pol === 'number' ? pol.toString() : '';
                          })()
                        }
                        </span>
                      </div>
                    )}
                    { selectedToken.decoded?.payload.exp && (
                      <div className="mt-2">
                      expiring
                        <span className="inline-flex items-center rounded-md bg-pink-50 px-2 py-1 mx-3 font-medium text-pink-700 ring-1 ring-pink-600/20 ring-inset text-sm">
                        { formatTimestamp(selectedToken.decoded?.payload.exp) }
                        </span>
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </div>
            )}

            <button
              onClick={resetDecoder}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 focus:ring-4 focus:ring-white/30 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/20"
            >
              Decode Another Token
            </button>
            <Tooltip id="did-tooltip" />
          </div>
        )}

        {selectedToken && (
          <div className="space-y-8">
            {/* {renderJSONSection('Header', getSelectedTokenData()!.token.issuer, 'header')} */}
            {renderJSONSection(selectedToken?.decoded?.payload, 'payload')}
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Signature</h3>
                <button
                  onClick={() => copyToClipboard(signatureHex(selectedToken?.decoded?.signature!), 'signature')}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  {copied === 'signature' ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copied === 'signature' ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-50/90 p-4 rounded-lg border border-gray-200/50 font-mono text-sm break-all text-gray-700 shadow-inner">
                {signatureHex(selectedToken?.decoded?.signature!)}
              </div>
              <p className="text-sm text-gray-600 mt-3 p-3 bg-yellow-50/50 rounded-lg border border-yellow-200/30">
                <strong>Note:</strong> The signature is used to verify the token's authenticity and cannot be decoded without the secret key.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NUCDecoder;