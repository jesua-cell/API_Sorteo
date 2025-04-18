import React, { useState, useRef, useEffect } from 'react'
import zelle from '../assets/zelle.png'
import nequi from '../assets/nequi.png'

export const Sorteo = () => {

    const [searchTerm, setSearchTerm] = useState('');
    const [selectNumbers, setSelectNumbers] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const listaRef = useRef();

    useEffect(() => {

        const handleClick = (e) => {

            const numemeroElement = e.target.closest('.listaNumero');

            if (numemeroElement) {
                const numero = numemeroElement.textContent;

                setSelectNumbers(prev =>
                    prev.includes(numero) ? prev.filter(n => n !== numero) : [...prev, numero]
                )
            };

        }
        const lista = listaRef.current;
        lista?.addEventListener('click', handleClick);

        return () => lista?.removeEventListener('click', handleClick)
    }, [])

    const handleSearch = (e) => {

        const inputValue = e.target.value;

        const searchValue = inputValue === '' ? '' : String(inputValue).padStart(4, '0');

        setSearchTerm(searchValue);

        if (listaRef.current) {
            Array.from(listaRef.current.children).forEach(child => {
                const numero = child.textContent;
                child.style.display = searchValue === '' || numero.includes(searchValue) ? 'block' : 'none';
            })
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreviewImage(null);
    };

    const seleccionar = (index) => {
        setActiveTab(index);
    };

    return (
        <>
            <div className='contSorteo'>
                <div className='contenidoSorteo'>

                    <h1 className='tituloSorteo'>Lista de Boletos</h1>

                    <h3>Numeros de Boletos: </h3>


                    {/* <button className='btnBuscar'>Buscar</button> */}
                    <input
                        type="number"
                        placeholder='Buscar'
                        className='btnBuscar'
                        onChange={handleSearch}
                        min="1"
                        max="1000"
                        onWheel={(e) => e.target.blur()}
                    />

                    <div className="lista" ref={listaRef}>
                        <div className="listaNumero">0001</div>
                        <div className="listaNumero">0002</div>
                        <div className="listaNumero">0003</div>
                        <div className="listaNumero">0004</div>
                        <div className="listaNumero">0005</div>
                        <div className="listaNumero">0006</div>
                        <div className="listaNumero">0007</div>
                        <div className="listaNumero">0008</div>
                        <div className="listaNumero">0009</div>
                        <div className="listaNumero">0010</div>
                        <div className="listaNumero">0011</div>
                        <div className="listaNumero">0012</div>
                        <div className="listaNumero">0013</div>
                        <div className="listaNumero">0014</div>
                        <div className="listaNumero">0015</div>
                        <div className="listaNumero">0016</div>
                        <div className="listaNumero">0017</div>
                        <div className="listaNumero">0018</div>
                        <div className="listaNumero">0019</div>
                        <div className="listaNumero">0020</div>
                        <div className="listaNumero">0021</div>
                        <div className="listaNumero">0022</div>
                        <div className="listaNumero">0023</div>
                        <div className="listaNumero">0024</div>
                        <div className="listaNumero">0025</div>
                        <div className="listaNumero">0026</div>
                        <div className="listaNumero">0027</div>
                        <div className="listaNumero">0028</div>
                        <div className="listaNumero">0029</div>
                        <div className="listaNumero">0030</div>
                        <div className="listaNumero">0031</div>
                        <div className="listaNumero">0032</div>
                        <div className="listaNumero">0033</div>
                        <div className="listaNumero">0034</div>
                        <div className="listaNumero">0035</div>
                        <div className="listaNumero">0036</div>
                        <div className="listaNumero">0037</div>
                        <div className="listaNumero">0038</div>
                        <div className="listaNumero">0039</div>
                        <div className="listaNumero">0040</div>
                        <div className="listaNumero">0041</div>
                        <div className="listaNumero">0042</div>
                        <div className="listaNumero">0043</div>
                        <div className="listaNumero">0044</div>
                        <div className="listaNumero">0045</div>
                        <div className="listaNumero">0046</div>
                        <div className="listaNumero">0047</div>
                        <div className="listaNumero">0048</div>
                        <div className="listaNumero">0049</div>
                        <div className="listaNumero">0050</div>
                        <div className="listaNumero">0051</div>
                        <div className="listaNumero">0052</div>
                        <div className="listaNumero">0053</div>
                        <div className="listaNumero">0054</div>
                        <div className="listaNumero">0055</div>
                        <div className="listaNumero">0056</div>
                        <div className="listaNumero">0057</div>
                        <div className="listaNumero">0058</div>
                        <div className="listaNumero">0059</div>
                        <div className="listaNumero">0060</div>
                        <div className="listaNumero">0061</div>
                        <div className="listaNumero">0062</div>
                        <div className="listaNumero">0063</div>
                        <div className="listaNumero">0064</div>
                        <div className="listaNumero">0065</div>
                        <div className="listaNumero">0066</div>
                        <div className="listaNumero">0067</div>
                        <div className="listaNumero">0068</div>
                        <div className="listaNumero">0069</div>
                        <div className="listaNumero">0070</div>
                        <div className="listaNumero">0071</div>
                        <div className="listaNumero">0072</div>
                        <div className="listaNumero">0073</div>
                        <div className="listaNumero">0074</div>
                        <div className="listaNumero">0075</div>
                        <div className="listaNumero">0076</div>
                        <div className="listaNumero">0077</div>
                        <div className="listaNumero">0078</div>
                        <div className="listaNumero">0079</div>
                        <div className="listaNumero">0080</div>
                        <div className="listaNumero">0081</div>
                        <div className="listaNumero">0082</div>
                        <div className="listaNumero">0083</div>
                        <div className="listaNumero">0084</div>
                        <div className="listaNumero">0085</div>
                        <div className="listaNumero">0086</div>
                        <div className="listaNumero">0087</div>
                        <div className="listaNumero">0088</div>
                        <div className="listaNumero">0089</div>
                        <div className="listaNumero">0090</div>
                        <div className="listaNumero">0091</div>
                        <div className="listaNumero">0092</div>
                        <div className="listaNumero">0093</div>
                        <div className="listaNumero">0094</div>
                        <div className="listaNumero">0095</div>
                        <div className="listaNumero">0096</div>
                        <div className="listaNumero">0097</div>
                        <div className="listaNumero">0098</div>
                        <div className="listaNumero">0099</div>
                        <div className="listaNumero">0100</div>
                        <div className="listaNumero">0101</div>
                        <div className="listaNumero">0102</div>
                        <div className="listaNumero">0103</div>
                        <div className="listaNumero">0104</div>
                        <div className="listaNumero">0105</div>
                        <div className="listaNumero">0106</div>
                        <div className="listaNumero">0107</div>
                        <div className="listaNumero">0108</div>
                        <div className="listaNumero">0109</div>
                        <div className="listaNumero">0110</div>
                        <div className="listaNumero">0111</div>
                        <div className="listaNumero">0112</div>
                        <div className="listaNumero">0113</div>
                        <div className="listaNumero">0114</div>
                        <div className="listaNumero">0115</div>
                        <div className="listaNumero">0116</div>
                        <div className="listaNumero">0117</div>
                        <div className="listaNumero">0118</div>
                        <div className="listaNumero">0119</div>
                        <div className="listaNumero">0120</div>
                        <div className="listaNumero">0121</div>
                        <div className="listaNumero">0122</div>
                        <div className="listaNumero">0123</div>
                        <div className="listaNumero">0124</div>
                        <div className="listaNumero">0125</div>
                        <div className="listaNumero">0126</div>
                        <div className="listaNumero">0127</div>
                        <div className="listaNumero">0128</div>
                        <div className="listaNumero">0129</div>
                        <div className="listaNumero">0130</div>
                        <div className="listaNumero">0131</div>
                        <div className="listaNumero">0132</div>
                        <div className="listaNumero">0133</div>
                        <div className="listaNumero">0134</div>
                        <div className="listaNumero">0135</div>
                        <div className="listaNumero">0136</div>
                        <div className="listaNumero">0137</div>
                        <div className="listaNumero">0138</div>
                        <div className="listaNumero">0139</div>
                        <div className="listaNumero">0140</div>
                        <div className="listaNumero">0141</div>
                        <div className="listaNumero">0142</div>
                        <div className="listaNumero">0143</div>
                        <div className="listaNumero">0144</div>
                        <div className="listaNumero">0145</div>
                        <div className="listaNumero">0146</div>
                        <div className="listaNumero">0147</div>
                        <div className="listaNumero">0148</div>
                        <div className="listaNumero">0149</div>
                        <div className="listaNumero">0150</div>
                        <div className="listaNumero">0151</div>
                        <div className="listaNumero">0152</div>
                        <div className="listaNumero">0153</div>
                        <div className="listaNumero">0154</div>
                        <div className="listaNumero">0155</div>
                        <div className="listaNumero">0156</div>
                        <div className="listaNumero">0157</div>
                        <div className="listaNumero">0158</div>
                        <div className="listaNumero">0159</div>
                        <div className="listaNumero">0160</div>
                        <div className="listaNumero">0161</div>
                        <div className="listaNumero">0162</div>
                        <div className="listaNumero">0163</div>
                        <div className="listaNumero">0164</div>
                        <div className="listaNumero">0165</div>
                        <div className="listaNumero">0166</div>
                        <div className="listaNumero">0167</div>
                        <div className="listaNumero">0168</div>
                        <div className="listaNumero">0169</div>
                        <div className="listaNumero">0170</div>
                        <div className="listaNumero">0171</div>
                        <div className="listaNumero">0172</div>
                        <div className="listaNumero">0173</div>
                        <div className="listaNumero">0174</div>
                        <div className="listaNumero">0175</div>
                        <div className="listaNumero">0176</div>
                        <div className="listaNumero">0177</div>
                        <div className="listaNumero">0178</div>
                        <div className="listaNumero">0179</div>
                        <div className="listaNumero">0180</div>
                        <div className="listaNumero">0181</div>
                        <div className="listaNumero">0182</div>
                        <div className="listaNumero">0183</div>
                        <div className="listaNumero">0184</div>
                        <div className="listaNumero">0185</div>
                        <div className="listaNumero">0186</div>
                        <div className="listaNumero">0187</div>
                        <div className="listaNumero">0188</div>
                        <div className="listaNumero">0189</div>
                        <div className="listaNumero">0190</div>
                        <div className="listaNumero">0191</div>
                        <div className="listaNumero">0192</div>
                        <div className="listaNumero">0193</div>
                        <div className="listaNumero">0194</div>
                        <div className="listaNumero">0195</div>
                        <div className="listaNumero">0196</div>
                        <div className="listaNumero">0197</div>
                        <div className="listaNumero">0198</div>
                        <div className="listaNumero">0199</div>
                        <div className="listaNumero">0200</div>
                        <div className="listaNumero">0201</div>
                        <div className="listaNumero">0202</div>
                        <div className="listaNumero">0203</div>
                        <div className="listaNumero">0204</div>
                        <div className="listaNumero">0205</div>
                        <div className="listaNumero">0206</div>
                        <div className="listaNumero">0207</div>
                        <div className="listaNumero">0208</div>
                        <div className="listaNumero">0209</div>
                        <div className="listaNumero">0210</div>
                        <div className="listaNumero">0211</div>
                        <div className="listaNumero">0212</div>
                        <div className="listaNumero">0213</div>
                        <div className="listaNumero">0214</div>
                        <div className="listaNumero">0215</div>
                        <div className="listaNumero">0216</div>
                        <div className="listaNumero">0217</div>
                        <div className="listaNumero">0218</div>
                        <div className="listaNumero">0219</div>
                        <div className="listaNumero">0220</div>
                        <div className="listaNumero">0221</div>
                        <div className="listaNumero">0222</div>
                        <div className="listaNumero">0223</div>
                        <div className="listaNumero">0224</div>
                        <div className="listaNumero">0225</div>
                        <div className="listaNumero">0226</div>
                        <div className="listaNumero">0227</div>
                        <div className="listaNumero">0228</div>
                        <div className="listaNumero">0229</div>
                        <div className="listaNumero">0230</div>
                        <div className="listaNumero">0231</div>
                        <div className="listaNumero">0232</div>
                        <div className="listaNumero">0233</div>
                        <div className="listaNumero">0234</div>
                        <div className="listaNumero">0235</div>
                        <div className="listaNumero">0236</div>
                        <div className="listaNumero">0237</div>
                        <div className="listaNumero">0238</div>
                        <div className="listaNumero">0239</div>
                        <div className="listaNumero">0240</div>
                        <div className="listaNumero">0241</div>
                        <div className="listaNumero">0242</div>
                        <div className="listaNumero">0243</div>
                        <div className="listaNumero">0244</div>
                        <div className="listaNumero">0245</div>
                        <div className="listaNumero">0246</div>
                        <div className="listaNumero">0247</div>
                        <div className="listaNumero">0248</div>
                        <div className="listaNumero">0249</div>
                        <div className="listaNumero">0250</div>
                        <div className="listaNumero">0251</div>
                        <div className="listaNumero">0252</div>
                        <div className="listaNumero">0253</div>
                        <div className="listaNumero">0254</div>
                        <div className="listaNumero">0255</div>
                        <div className="listaNumero">0256</div>
                        <div className="listaNumero">0257</div>
                        <div className="listaNumero">0258</div>
                        <div className="listaNumero">0259</div>
                        <div className="listaNumero">0260</div>
                        <div className="listaNumero">0261</div>
                        <div className="listaNumero">0262</div>
                        <div className="listaNumero">0263</div>
                        <div className="listaNumero">0264</div>
                        <div className="listaNumero">0265</div>
                        <div className="listaNumero">0266</div>
                        <div className="listaNumero">0267</div>
                        <div className="listaNumero">0268</div>
                        <div className="listaNumero">0269</div>
                        <div className="listaNumero">0270</div>
                        <div className="listaNumero">0271</div>
                        <div className="listaNumero">0272</div>
                        <div className="listaNumero">0273</div>
                        <div className="listaNumero">0274</div>
                        <div className="listaNumero">0275</div>
                        <div className="listaNumero">0276</div>
                        <div className="listaNumero">0277</div>
                        <div className="listaNumero">0278</div>
                        <div className="listaNumero">0279</div>
                        <div className="listaNumero">0280</div>
                        <div className="listaNumero">0281</div>
                        <div className="listaNumero">0282</div>
                        <div className="listaNumero">0283</div>
                        <div className="listaNumero">0284</div>
                        <div className="listaNumero">0285</div>
                        <div className="listaNumero">0286</div>
                        <div className="listaNumero">0287</div>
                        <div className="listaNumero">0288</div>
                        <div className="listaNumero">0289</div>
                        <div className="listaNumero">0290</div>
                        <div className="listaNumero">0291</div>
                        <div className="listaNumero">0292</div>
                        <div className="listaNumero">0293</div>
                        <div className="listaNumero">0294</div>
                        <div className="listaNumero">0295</div>
                        <div className="listaNumero">0296</div>
                        <div className="listaNumero">0297</div>
                        <div className="listaNumero">0298</div>
                        <div className="listaNumero">0299</div>
                        <div className="listaNumero">0300</div>
                        <div className="listaNumero">0301</div>
                        <div className="listaNumero">0302</div>
                        <div className="listaNumero">0303</div>
                        <div className="listaNumero">0304</div>
                        <div className="listaNumero">0305</div>
                        <div className="listaNumero">0306</div>
                        <div className="listaNumero">0307</div>
                        <div className="listaNumero">0308</div>
                        <div className="listaNumero">0309</div>
                        <div className="listaNumero">0310</div>
                        <div className="listaNumero">0311</div>
                        <div className="listaNumero">0312</div>
                        <div className="listaNumero">0313</div>
                        <div className="listaNumero">0314</div>
                        <div className="listaNumero">0315</div>
                        <div className="listaNumero">0316</div>
                        <div className="listaNumero">0317</div>
                        <div className="listaNumero">0318</div>
                        <div className="listaNumero">0319</div>
                        <div className="listaNumero">0320</div>
                        <div className="listaNumero">0321</div>
                        <div className="listaNumero">0322</div>
                        <div className="listaNumero">0323</div>
                        <div className="listaNumero">0324</div>
                        <div className="listaNumero">0325</div>
                        <div className="listaNumero">0326</div>
                        <div className="listaNumero">0327</div>
                        <div className="listaNumero">0328</div>
                        <div className="listaNumero">0329</div>
                        <div className="listaNumero">0330</div>
                        <div className="listaNumero">0331</div>
                        <div className="listaNumero">0332</div>
                        <div className="listaNumero">0333</div>
                        <div className="listaNumero">0334</div>
                        <div className="listaNumero">0335</div>
                        <div className="listaNumero">0336</div>
                        <div className="listaNumero">0337</div>
                        <div className="listaNumero">0338</div>
                        <div className="listaNumero">0339</div>
                        <div className="listaNumero">0340</div>
                        <div className="listaNumero">0341</div>
                        <div className="listaNumero">0342</div>
                        <div className="listaNumero">0343</div>
                        <div className="listaNumero">0344</div>
                        <div className="listaNumero">0345</div>
                        <div className="listaNumero">0346</div>
                        <div className="listaNumero">0347</div>
                        <div className="listaNumero">0348</div>
                        <div className="listaNumero">0349</div>
                        <div className="listaNumero">0350</div>
                        <div className="listaNumero">0351</div>
                        <div className="listaNumero">0352</div>
                        <div className="listaNumero">0353</div>
                        <div className="listaNumero">0354</div>
                        <div className="listaNumero">0355</div>
                        <div className="listaNumero">0356</div>
                        <div className="listaNumero">0357</div>
                        <div className="listaNumero">0358</div>
                        <div className="listaNumero">0359</div>
                        <div className="listaNumero">0360</div>
                        <div className="listaNumero">0361</div>
                        <div className="listaNumero">0362</div>
                        <div className="listaNumero">0363</div>
                        <div className="listaNumero">0364</div>
                        <div className="listaNumero">0365</div>
                        <div className="listaNumero">0366</div>
                        <div className="listaNumero">0367</div>
                        <div className="listaNumero">0368</div>
                        <div className="listaNumero">0369</div>
                        <div className="listaNumero">0370</div>
                        <div className="listaNumero">0371</div>
                        <div className="listaNumero">0372</div>
                        <div className="listaNumero">0373</div>
                        <div className="listaNumero">0374</div>
                        <div className="listaNumero">0375</div>
                        <div className="listaNumero">0376</div>
                        <div className="listaNumero">0377</div>
                        <div className="listaNumero">0378</div>
                        <div className="listaNumero">0379</div>
                        <div className="listaNumero">0380</div>
                        <div className="listaNumero">0381</div>
                        <div className="listaNumero">0382</div>
                        <div className="listaNumero">0383</div>
                        <div className="listaNumero">0384</div>
                        <div className="listaNumero">0385</div>
                        <div className="listaNumero">0386</div>
                        <div className="listaNumero">0387</div>
                        <div className="listaNumero">0388</div>
                        <div className="listaNumero">0389</div>
                        <div className="listaNumero">0390</div>
                        <div className="listaNumero">0391</div>
                        <div className="listaNumero">0392</div>
                        <div className="listaNumero">0393</div>
                        <div className="listaNumero">0394</div>
                        <div className="listaNumero">0395</div>
                        <div className="listaNumero">0396</div>
                        <div className="listaNumero">0397</div>
                        <div className="listaNumero">0398</div>
                        <div className="listaNumero">0399</div>
                        <div className="listaNumero">0400</div>
                        <div className="listaNumero">0401</div>
                        <div className="listaNumero">0402</div>
                        <div className="listaNumero">0403</div>
                        <div className="listaNumero">0404</div>
                        <div className="listaNumero">0405</div>
                        <div className="listaNumero">0406</div>
                        <div className="listaNumero">0407</div>
                        <div className="listaNumero">0408</div>
                        <div className="listaNumero">0409</div>
                        <div className="listaNumero">0410</div>
                        <div className="listaNumero">0411</div>
                        <div className="listaNumero">0412</div>
                        <div className="listaNumero">0413</div>
                        <div className="listaNumero">0414</div>
                        <div className="listaNumero">0415</div>
                        <div className="listaNumero">0416</div>
                        <div className="listaNumero">0417</div>
                        <div className="listaNumero">0418</div>
                        <div className="listaNumero">0419</div>
                        <div className="listaNumero">0420</div>
                        <div className="listaNumero">0421</div>
                        <div className="listaNumero">0422</div>
                        <div className="listaNumero">0423</div>
                        <div className="listaNumero">0424</div>
                        <div className="listaNumero">0425</div>
                        <div className="listaNumero">0426</div>
                        <div className="listaNumero">0427</div>
                        <div className="listaNumero">0428</div>
                        <div className="listaNumero">0429</div>
                        <div className="listaNumero">0430</div>
                        <div className="listaNumero">0431</div>
                        <div className="listaNumero">0432</div>
                        <div className="listaNumero">0433</div>
                        <div className="listaNumero">0434</div>
                        <div className="listaNumero">0435</div>
                        <div className="listaNumero">0436</div>
                        <div className="listaNumero">0437</div>
                        <div className="listaNumero">0438</div>
                        <div className="listaNumero">0439</div>
                        <div className="listaNumero">0440</div>
                        <div className="listaNumero">0441</div>
                        <div className="listaNumero">0442</div>
                        <div className="listaNumero">0443</div>
                        <div className="listaNumero">0444</div>
                        <div className="listaNumero">0445</div>
                        <div className="listaNumero">0446</div>
                        <div className="listaNumero">0447</div>
                        <div className="listaNumero">0448</div>
                        <div className="listaNumero">0449</div>
                        <div className="listaNumero">0450</div>
                        <div className="listaNumero">0451</div>
                        <div className="listaNumero">0452</div>
                        <div className="listaNumero">0453</div>
                        <div className="listaNumero">0454</div>
                        <div className="listaNumero">0455</div>
                        <div className="listaNumero">0456</div>
                        <div className="listaNumero">0457</div>
                        <div className="listaNumero">0458</div>
                        <div className="listaNumero">0459</div>
                        <div className="listaNumero">0460</div>
                        <div className="listaNumero">0461</div>
                        <div className="listaNumero">0462</div>
                        <div className="listaNumero">0463</div>
                        <div className="listaNumero">0464</div>
                        <div className="listaNumero">0465</div>
                        <div className="listaNumero">0466</div>
                        <div className="listaNumero">0467</div>
                        <div className="listaNumero">0468</div>
                        <div className="listaNumero">0469</div>
                        <div className="listaNumero">0470</div>
                        <div className="listaNumero">0471</div>
                        <div className="listaNumero">0472</div>
                        <div className="listaNumero">0473</div>
                        <div className="listaNumero">0474</div>
                        <div className="listaNumero">0475</div>
                        <div className="listaNumero">0476</div>
                        <div className="listaNumero">0477</div>
                        <div className="listaNumero">0478</div>
                        <div className="listaNumero">0479</div>
                        <div className="listaNumero">0480</div>
                        <div className="listaNumero">0481</div>
                        <div className="listaNumero">0482</div>
                        <div className="listaNumero">0483</div>
                        <div className="listaNumero">0484</div>
                        <div className="listaNumero">0485</div>
                        <div className="listaNumero">0486</div>
                        <div className="listaNumero">0487</div>
                        <div className="listaNumero">0488</div>
                        <div className="listaNumero">0489</div>
                        <div className="listaNumero">0490</div>
                        <div className="listaNumero">0491</div>
                        <div className="listaNumero">0492</div>
                        <div className="listaNumero">0493</div>
                        <div className="listaNumero">0494</div>
                        <div className="listaNumero">0495</div>
                        <div className="listaNumero">0496</div>
                        <div className="listaNumero">0497</div>
                        <div className="listaNumero">0498</div>
                        <div className="listaNumero">0499</div>
                        <div className="listaNumero">0500</div>
                        <div className="listaNumero">0501</div>
                        <div className="listaNumero">0502</div>
                        <div className="listaNumero">0503</div>
                        <div className="listaNumero">0504</div>
                        <div className="listaNumero">0505</div>
                        <div className="listaNumero">0506</div>
                        <div className="listaNumero">0507</div>
                        <div className="listaNumero">0508</div>
                        <div className="listaNumero">0509</div>
                        <div className="listaNumero">0510</div>
                        <div className="listaNumero">0511</div>
                        <div className="listaNumero">0512</div>
                        <div className="listaNumero">0513</div>
                        <div className="listaNumero">0514</div>
                        <div className="listaNumero">0515</div>
                        <div className="listaNumero">0516</div>
                        <div className="listaNumero">0517</div>
                        <div className="listaNumero">0518</div>
                        <div className="listaNumero">0519</div>
                        <div className="listaNumero">0520</div>
                        <div className="listaNumero">0521</div>
                        <div className="listaNumero">0522</div>
                        <div className="listaNumero">0523</div>
                        <div className="listaNumero">0524</div>
                        <div className="listaNumero">0525</div>
                        <div className="listaNumero">0526</div>
                        <div className="listaNumero">0527</div>
                        <div className="listaNumero">0528</div>
                        <div className="listaNumero">0529</div>
                        <div className="listaNumero">0530</div>
                        <div className="listaNumero">0531</div>
                        <div className="listaNumero">0532</div>
                        <div className="listaNumero">0533</div>
                        <div className="listaNumero">0534</div>
                        <div className="listaNumero">0535</div>
                        <div className="listaNumero">0536</div>
                        <div className="listaNumero">0537</div>
                        <div className="listaNumero">0538</div>
                        <div className="listaNumero">0539</div>
                        <div className="listaNumero">0540</div>
                        <div className="listaNumero">0541</div>
                        <div className="listaNumero">0542</div>
                        <div className="listaNumero">0543</div>
                        <div className="listaNumero">0544</div>
                        <div className="listaNumero">0545</div>
                        <div className="listaNumero">0546</div>
                        <div className="listaNumero">0547</div>
                        <div className="listaNumero">0548</div>
                        <div className="listaNumero">0549</div>
                        <div className="listaNumero">0550</div>
                        <div className="listaNumero">0551</div>
                        <div className="listaNumero">0552</div>
                        <div className="listaNumero">0553</div>
                        <div className="listaNumero">0554</div>
                        <div className="listaNumero">0555</div>
                        <div className="listaNumero">0556</div>
                        <div className="listaNumero">0557</div>
                        <div className="listaNumero">0558</div>
                        <div className="listaNumero">0559</div>
                        <div className="listaNumero">0560</div>
                        <div className="listaNumero">0561</div>
                        <div className="listaNumero">0562</div>
                        <div className="listaNumero">0563</div>
                        <div className="listaNumero">0564</div>
                        <div className="listaNumero">0565</div>
                        <div className="listaNumero">0566</div>
                        <div className="listaNumero">0567</div>
                        <div className="listaNumero">0568</div>
                        <div className="listaNumero">0569</div>
                        <div className="listaNumero">0570</div>
                        <div className="listaNumero">0571</div>
                        <div className="listaNumero">0572</div>
                        <div className="listaNumero">0573</div>
                        <div className="listaNumero">0574</div>
                        <div className="listaNumero">0575</div>
                        <div className="listaNumero">0576</div>
                        <div className="listaNumero">0577</div>
                        <div className="listaNumero">0578</div>
                        <div className="listaNumero">0579</div>
                        <div className="listaNumero">0580</div>
                        <div className="listaNumero">0581</div>
                        <div className="listaNumero">0582</div>
                        <div className="listaNumero">0583</div>
                        <div className="listaNumero">0584</div>
                        <div className="listaNumero">0585</div>
                        <div className="listaNumero">0586</div>
                        <div className="listaNumero">0587</div>
                        <div className="listaNumero">0588</div>
                        <div className="listaNumero">0589</div>
                        <div className="listaNumero">0590</div>
                        <div className="listaNumero">0591</div>
                        <div className="listaNumero">0592</div>
                        <div className="listaNumero">0593</div>
                        <div className="listaNumero">0594</div>
                        <div className="listaNumero">0595</div>
                        <div className="listaNumero">0596</div>
                        <div className="listaNumero">0597</div>
                        <div className="listaNumero">0598</div>
                        <div className="listaNumero">0599</div>
                        <div className="listaNumero">0600</div>
                        <div className="listaNumero">0601</div>
                        <div className="listaNumero">0602</div>
                        <div className="listaNumero">0603</div>
                        <div className="listaNumero">0604</div>
                        <div className="listaNumero">0605</div>
                        <div className="listaNumero">0606</div>
                        <div className="listaNumero">0607</div>
                        <div className="listaNumero">0608</div>
                        <div className="listaNumero">0609</div>
                        <div className="listaNumero">0610</div>
                        <div className="listaNumero">0611</div>
                        <div className="listaNumero">0612</div>
                        <div className="listaNumero">0613</div>
                        <div className="listaNumero">0614</div>
                        <div className="listaNumero">0615</div>
                        <div className="listaNumero">0616</div>
                        <div className="listaNumero">0617</div>
                        <div className="listaNumero">0618</div>
                        <div className="listaNumero">0619</div>
                        <div className="listaNumero">0620</div>
                        <div className="listaNumero">0621</div>
                        <div className="listaNumero">0622</div>
                        <div className="listaNumero">0623</div>
                        <div className="listaNumero">0624</div>
                        <div className="listaNumero">0625</div>
                        <div className="listaNumero">0626</div>
                        <div className="listaNumero">0627</div>
                        <div className="listaNumero">0628</div>
                        <div className="listaNumero">0629</div>
                        <div className="listaNumero">0630</div>
                        <div className="listaNumero">0631</div>
                        <div className="listaNumero">0632</div>
                        <div className="listaNumero">0633</div>
                        <div className="listaNumero">0634</div>
                        <div className="listaNumero">0635</div>
                        <div className="listaNumero">0636</div>
                        <div className="listaNumero">0637</div>
                        <div className="listaNumero">0638</div>
                        <div className="listaNumero">0639</div>
                        <div className="listaNumero">0640</div>
                        <div className="listaNumero">0641</div>
                        <div className="listaNumero">0642</div>
                        <div className="listaNumero">0643</div>
                        <div className="listaNumero">0644</div>
                        <div className="listaNumero">0645</div>
                        <div className="listaNumero">0646</div>
                        <div className="listaNumero">0647</div>
                        <div className="listaNumero">0648</div>
                        <div className="listaNumero">0649</div>
                        <div className="listaNumero">0650</div>
                        <div className="listaNumero">0651</div>
                        <div className="listaNumero">0652</div>
                        <div className="listaNumero">0653</div>
                        <div className="listaNumero">0654</div>
                        <div className="listaNumero">0655</div>
                        <div className="listaNumero">0656</div>
                        <div className="listaNumero">0657</div>
                        <div className="listaNumero">0658</div>
                        <div className="listaNumero">0659</div>
                        <div className="listaNumero">0660</div>
                        <div className="listaNumero">0661</div>
                        <div className="listaNumero">0662</div>
                        <div className="listaNumero">0663</div>
                        <div className="listaNumero">0664</div>
                        <div className="listaNumero">0665</div>
                        <div className="listaNumero">0666</div>
                        <div className="listaNumero">0667</div>
                        <div className="listaNumero">0668</div>
                        <div className="listaNumero">0669</div>
                        <div className="listaNumero">0670</div>
                        <div className="listaNumero">0671</div>
                        <div className="listaNumero">0672</div>
                        <div className="listaNumero">0673</div>
                        <div className="listaNumero">0674</div>
                        <div className="listaNumero">0675</div>
                        <div className="listaNumero">0676</div>
                        <div className="listaNumero">0677</div>
                        <div className="listaNumero">0678</div>
                        <div className="listaNumero">0679</div>
                        <div className="listaNumero">0680</div>
                        <div className="listaNumero">0681</div>
                        <div className="listaNumero">0682</div>
                        <div className="listaNumero">0683</div>
                        <div className="listaNumero">0684</div>
                        <div className="listaNumero">0685</div>
                        <div className="listaNumero">0686</div>
                        <div className="listaNumero">0687</div>
                        <div className="listaNumero">0688</div>
                        <div className="listaNumero">0689</div>
                        <div className="listaNumero">0690</div>
                        <div className="listaNumero">0691</div>
                        <div className="listaNumero">0692</div>
                        <div className="listaNumero">0693</div>
                        <div className="listaNumero">0694</div>
                        <div className="listaNumero">0695</div>
                        <div className="listaNumero">0696</div>
                        <div className="listaNumero">0697</div>
                        <div className="listaNumero">0698</div>
                        <div className="listaNumero">0699</div>
                        <div className="listaNumero">0700</div>
                        <div className="listaNumero">0701</div>
                        <div className="listaNumero">0702</div>
                        <div className="listaNumero">0703</div>
                        <div className="listaNumero">0704</div>
                        <div className="listaNumero">0705</div>
                        <div className="listaNumero">0706</div>
                        <div className="listaNumero">0707</div>
                        <div className="listaNumero">0708</div>
                        <div className="listaNumero">0709</div>
                        <div className="listaNumero">0710</div>
                        <div className="listaNumero">0711</div>
                        <div className="listaNumero">0712</div>
                        <div className="listaNumero">0713</div>
                        <div className="listaNumero">0714</div>
                        <div className="listaNumero">0715</div>
                        <div className="listaNumero">0716</div>
                        <div className="listaNumero">0717</div>
                        <div className="listaNumero">0718</div>
                        <div className="listaNumero">0719</div>
                        <div className="listaNumero">0720</div>
                        <div className="listaNumero">0721</div>
                        <div className="listaNumero">0722</div>
                        <div className="listaNumero">0723</div>
                        <div className="listaNumero">0724</div>
                        <div className="listaNumero">0725</div>
                        <div className="listaNumero">0726</div>
                        <div className="listaNumero">0727</div>
                        <div className="listaNumero">0728</div>
                        <div className="listaNumero">0729</div>
                        <div className="listaNumero">0730</div>
                        <div className="listaNumero">0731</div>
                        <div className="listaNumero">0732</div>
                        <div className="listaNumero">0733</div>
                        <div className="listaNumero">0734</div>
                        <div className="listaNumero">0735</div>
                        <div className="listaNumero">0736</div>
                        <div className="listaNumero">0737</div>
                        <div className="listaNumero">0738</div>
                        <div className="listaNumero">0739</div>
                        <div className="listaNumero">0740</div>
                        <div className="listaNumero">0741</div>
                        <div className="listaNumero">0742</div>
                        <div className="listaNumero">0743</div>
                        <div className="listaNumero">0744</div>
                        <div className="listaNumero">0745</div>
                        <div className="listaNumero">0746</div>
                        <div className="listaNumero">0747</div>
                        <div className="listaNumero">0748</div>
                        <div className="listaNumero">0749</div>
                        <div className="listaNumero">0750</div>
                        <div className="listaNumero">0751</div>
                        <div className="listaNumero">0752</div>
                        <div className="listaNumero">0753</div>
                        <div className="listaNumero">0754</div>
                        <div className="listaNumero">0755</div>
                        <div className="listaNumero">0756</div>
                        <div className="listaNumero">0757</div>
                        <div className="listaNumero">0758</div>
                        <div className="listaNumero">0759</div>
                        <div className="listaNumero">0760</div>
                        <div className="listaNumero">0761</div>
                        <div className="listaNumero">0762</div>
                        <div className="listaNumero">0763</div>
                        <div className="listaNumero">0764</div>
                        <div className="listaNumero">0765</div>
                        <div className="listaNumero">0766</div>
                        <div className="listaNumero">0767</div>
                        <div className="listaNumero">0768</div>
                        <div className="listaNumero">0769</div>
                        <div className="listaNumero">0770</div>
                        <div className="listaNumero">0771</div>
                        <div className="listaNumero">0772</div>
                        <div className="listaNumero">0773</div>
                        <div className="listaNumero">0774</div>
                        <div className="listaNumero">0775</div>
                        <div className="listaNumero">0776</div>
                        <div className="listaNumero">0777</div>
                        <div className="listaNumero">0778</div>
                        <div className="listaNumero">0779</div>
                        <div className="listaNumero">0780</div>
                        <div className="listaNumero">0781</div>
                        <div className="listaNumero">0782</div>
                        <div className="listaNumero">0783</div>
                        <div className="listaNumero">0784</div>
                        <div className="listaNumero">0785</div>
                        <div className="listaNumero">0786</div>
                        <div className="listaNumero">0787</div>
                        <div className="listaNumero">0788</div>
                        <div className="listaNumero">0789</div>
                        <div className="listaNumero">0790</div>
                        <div className="listaNumero">0791</div>
                        <div className="listaNumero">0792</div>
                        <div className="listaNumero">0793</div>
                        <div className="listaNumero">0794</div>
                        <div className="listaNumero">0795</div>
                        <div className="listaNumero">0796</div>
                        <div className="listaNumero">0797</div>
                        <div className="listaNumero">0798</div>
                        <div className="listaNumero">0799</div>
                        <div className="listaNumero">0800</div>
                        <div className="listaNumero">0801</div>
                        <div className="listaNumero">0802</div>
                        <div className="listaNumero">0803</div>
                        <div className="listaNumero">0804</div>
                        <div className="listaNumero">0805</div>
                        <div className="listaNumero">0806</div>
                        <div className="listaNumero">0807</div>
                        <div className="listaNumero">0808</div>
                        <div className="listaNumero">0809</div>
                        <div className="listaNumero">0810</div>
                        <div className="listaNumero">0811</div>
                        <div className="listaNumero">0812</div>
                        <div className="listaNumero">0813</div>
                        <div className="listaNumero">0814</div>
                        <div className="listaNumero">0815</div>
                        <div className="listaNumero">0816</div>
                        <div className="listaNumero">0817</div>
                        <div className="listaNumero">0818</div>
                        <div className="listaNumero">0819</div>
                        <div className="listaNumero">0820</div>
                        <div className="listaNumero">0821</div>
                        <div className="listaNumero">0822</div>
                        <div className="listaNumero">0823</div>
                        <div className="listaNumero">0824</div>
                        <div className="listaNumero">0825</div>
                        <div className="listaNumero">0826</div>
                        <div className="listaNumero">0827</div>
                        <div className="listaNumero">0828</div>
                        <div className="listaNumero">0829</div>
                        <div className="listaNumero">0830</div>
                        <div className="listaNumero">0831</div>
                        <div className="listaNumero">0832</div>
                        <div className="listaNumero">0833</div>
                        <div className="listaNumero">0834</div>
                        <div className="listaNumero">0835</div>
                        <div className="listaNumero">0836</div>
                        <div className="listaNumero">0837</div>
                        <div className="listaNumero">0838</div>
                        <div className="listaNumero">0839</div>
                        <div className="listaNumero">0840</div>
                        <div className="listaNumero">0841</div>
                        <div className="listaNumero">0842</div>
                        <div className="listaNumero">0843</div>
                        <div className="listaNumero">0844</div>
                        <div className="listaNumero">0845</div>
                        <div className="listaNumero">0846</div>
                        <div className="listaNumero">0847</div>
                        <div className="listaNumero">0848</div>
                        <div className="listaNumero">0849</div>
                        <div className="listaNumero">0850</div>
                        <div className="listaNumero">0851</div>
                        <div className="listaNumero">0852</div>
                        <div className="listaNumero">0853</div>
                        <div className="listaNumero">0854</div>
                        <div className="listaNumero">0855</div>
                        <div className="listaNumero">0856</div>
                        <div className="listaNumero">0857</div>
                        <div className="listaNumero">0858</div>
                        <div className="listaNumero">0859</div>
                        <div className="listaNumero">0860</div>
                        <div className="listaNumero">0861</div>
                        <div className="listaNumero">0862</div>
                        <div className="listaNumero">0863</div>
                        <div className="listaNumero">0864</div>
                        <div className="listaNumero">0865</div>
                        <div className="listaNumero">0866</div>
                        <div className="listaNumero">0867</div>
                        <div className="listaNumero">0868</div>
                        <div className="listaNumero">0869</div>
                        <div className="listaNumero">0870</div>
                        <div className="listaNumero">0871</div>
                        <div className="listaNumero">0872</div>
                        <div className="listaNumero">0873</div>
                        <div className="listaNumero">0874</div>
                        <div className="listaNumero">0875</div>
                        <div className="listaNumero">0876</div>
                        <div className="listaNumero">0877</div>
                        <div className="listaNumero">0878</div>
                        <div className="listaNumero">0879</div>
                        <div className="listaNumero">0880</div>
                        <div className="listaNumero">0881</div>
                        <div className="listaNumero">0882</div>
                        <div className="listaNumero">0883</div>
                        <div className="listaNumero">0884</div>
                        <div className="listaNumero">0885</div>
                        <div className="listaNumero">0886</div>
                        <div className="listaNumero">0887</div>
                        <div className="listaNumero">0888</div>
                        <div className="listaNumero">0889</div>
                        <div className="listaNumero">0890</div>
                        <div className="listaNumero">0891</div>
                        <div className="listaNumero">0892</div>
                        <div className="listaNumero">0893</div>
                        <div className="listaNumero">0894</div>
                        <div className="listaNumero">0895</div>
                        <div className="listaNumero">0896</div>
                        <div className="listaNumero">0897</div>
                        <div className="listaNumero">0898</div>
                        <div className="listaNumero">0899</div>
                        <div className="listaNumero">0900</div>
                        <div className="listaNumero">0901</div>
                        <div className="listaNumero">0902</div>
                        <div className="listaNumero">0903</div>
                        <div className="listaNumero">0904</div>
                        <div className="listaNumero">0905</div>
                        <div className="listaNumero">0906</div>
                        <div className="listaNumero">0907</div>
                        <div className="listaNumero">0908</div>
                        <div className="listaNumero">0909</div>
                        <div className="listaNumero">0910</div>
                        <div className="listaNumero">0911</div>
                        <div className="listaNumero">0912</div>
                        <div className="listaNumero">0913</div>
                        <div className="listaNumero">0914</div>
                        <div className="listaNumero">0915</div>
                        <div className="listaNumero">0916</div>
                        <div className="listaNumero">0917</div>
                        <div className="listaNumero">0918</div>
                        <div className="listaNumero">0919</div>
                        <div className="listaNumero">0920</div>
                        <div className="listaNumero">0921</div>
                        <div className="listaNumero">0922</div>
                        <div className="listaNumero">0923</div>
                        <div className="listaNumero">0924</div>
                        <div className="listaNumero">0925</div>
                        <div className="listaNumero">0926</div>
                        <div className="listaNumero">0927</div>
                        <div className="listaNumero">0928</div>
                        <div className="listaNumero">0929</div>
                        <div className="listaNumero">0930</div>
                        <div className="listaNumero">0931</div>
                        <div className="listaNumero">0932</div>
                        <div className="listaNumero">0933</div>
                        <div className="listaNumero">0934</div>
                        <div className="listaNumero">0935</div>
                        <div className="listaNumero">0936</div>
                        <div className="listaNumero">0937</div>
                        <div className="listaNumero">0938</div>
                        <div className="listaNumero">0939</div>
                        <div className="listaNumero">0940</div>
                        <div className="listaNumero">0941</div>
                        <div className="listaNumero">0942</div>
                        <div className="listaNumero">0943</div>
                        <div className="listaNumero">0944</div>
                        <div className="listaNumero">0945</div>
                        <div className="listaNumero">0946</div>
                        <div className="listaNumero">0947</div>
                        <div className="listaNumero">0948</div>
                        <div className="listaNumero">0949</div>
                        <div className="listaNumero">0950</div>
                        <div className="listaNumero">0951</div>
                        <div className="listaNumero">0952</div>
                        <div className="listaNumero">0953</div>
                        <div className="listaNumero">0954</div>
                        <div className="listaNumero">0955</div>
                        <div className="listaNumero">0956</div>
                        <div className="listaNumero">0957</div>
                        <div className="listaNumero">0958</div>
                        <div className="listaNumero">0959</div>
                        <div className="listaNumero">0960</div>
                        <div className="listaNumero">0961</div>
                        <div className="listaNumero">0962</div>
                        <div className="listaNumero">0963</div>
                        <div className="listaNumero">0964</div>
                        <div className="listaNumero">0965</div>
                        <div className="listaNumero">0966</div>
                        <div className="listaNumero">0967</div>
                        <div className="listaNumero">0968</div>
                        <div className="listaNumero">0969</div>
                        <div className="listaNumero">0970</div>
                        <div className="listaNumero">0971</div>
                        <div className="listaNumero">0972</div>
                        <div className="listaNumero">0973</div>
                        <div className="listaNumero">0974</div>
                        <div className="listaNumero">0975</div>
                        <div className="listaNumero">0976</div>
                        <div className="listaNumero">0977</div>
                        <div className="listaNumero">0978</div>
                        <div className="listaNumero">0979</div>
                        <div className="listaNumero">0980</div>
                        <div className="listaNumero">0981</div>
                        <div className="listaNumero">0982</div>
                        <div className="listaNumero">0983</div>
                        <div className="listaNumero">0984</div>
                        <div className="listaNumero">0985</div>
                        <div className="listaNumero">0986</div>
                        <div className="listaNumero">0987</div>
                        <div className="listaNumero">0988</div>
                        <div className="listaNumero">0989</div>
                        <div className="listaNumero">0990</div>
                        <div className="listaNumero">0991</div>
                        <div className="listaNumero">0992</div>
                        <div className="listaNumero">0993</div>
                        <div className="listaNumero">0994</div>
                        <div className="listaNumero">0995</div>
                        <div className="listaNumero">0996</div>
                        <div className="listaNumero">0997</div>
                        <div className="listaNumero">0998</div>
                        <div className="listaNumero">0999</div>
                        <div className="listaNumero">1000</div>
                    </div>
                    <div className='numerosSeleccionados'>
                        <div className='contentSeleccionados'>
                            {/* <button className='btnSeleccionar'>«</button> */}
                            <h4>Seleccionados:</h4>
                            {/* <button className='btnSeleccionar'>»</button> */}
                        </div>
                        <div className='btnSeleccionado'>
                            <div className="num_select">
                                {selectNumbers.map((numero, index) => (
                                    <span key={index} className='num-item'>
                                        {numero}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <form className='formDatos'>
                        <label className='labelForm'>Nombres y Apellidos:</label>
                        <input type="text" placeholder='Nombres y Apellidos' />
                        <label className='labelForm'>Celular:</label>
                        <input type="number" placeholder='Celular' />
                        <label className='labelForm'>País o Estado:</label>
                        <input type="text" placeholder='País o Estados' />
                        <label className='labelForm'>Referencia de Pago:</label>
                        <input type="number" placeholder='(Ulitmos cuatro digítos)' />
                        <label className='labelForm'>Comprobante de Pago:</label>

                        <h3 className='titulo_medioPago'>Modo de Pago:</h3>
                        <span className='span_medioPago'>Elige una opcion</span>
                        <div className='medioPago'>
                            {/* <img className='imgPago' src={zelle} alt="Zelle" />
                            <img className='imgPago' src={nequi} alt="Nequi" /> */}
                            {/* <div className="modoPago">
                                <h4 className='nombrePago'>Zelle</h4>
                                <h4 className='cuenta'>Cuenta:</h4>
                                <h4 className='numeroCuenta'>6153625428</h4>
                                <h4 className='titular'>Titular:</h4>
                                <h4 className='remitente'>Francisco Javier Caicedo</h4>
                            </div>
                            <div className="modoPago">
                                <h4 className='nombrePago'>Nequi</h4>
                                <h4 className='cuenta'>Cuenta:</h4>
                                <h4 className='numeroCuenta'>3154854020</h4>
                                <h4 className='titular'>Titular:</h4>
                                <h4 className='remitente'>Donney Caicedo</h4>
                            </div> */}
                        </div>

                        <ul className="tabs">
                            <li className={activeTab == 0 ? "active" : ""} onClick={() => seleccionar(0)}>
                                <img className='imgPago' src={zelle} alt="Zelle" />
                            </li>
                            <li className={activeTab == 1 ? "active" : ""} onClick={() => seleccionar(1)}>
                                <img className='imgPago' src={nequi} alt="Nequi" />
                            </li>
                            <span className='indicador'></span>
                        </ul>
                        
                        <div className="tab_content">
                            {activeTab === 0 &&
                                <div className="modoPago">
                                    <h4 className='nombrePago'>Zelle</h4>
                                    <h4 className='cuenta'>Cuenta:</h4>
                                    <h4 className='numeroCuenta'>6153625428</h4>
                                    <h4 className='titular'>Titular:</h4>
                                    <h4 className='remitente'>Francisco Javier Caicedo</h4>
                                </div>
                            }
                            {activeTab === 1 &&
                                <div className="modoPago">
                                    <h4 className='nombrePago'>Nequi</h4>
                                    <h4 className='cuenta'>Cuenta:</h4>
                                    <h4 className='numeroCuenta'>3154854020</h4>
                                    <h4 className='titular'>Titular:</h4>
                                    <h4 className='remitente'>Donney Caicedo</h4>
                                </div>
                            }
                            {activeTab === 2 && <h1>Tab 3</h1>}
                        </div>

                        <div className='input_comprobatePago'>
                            <input
                                id='comprobantePago'
                                type="file"
                                accept='image/png, image/jpeg'
                                onChange={handleImageUpload}
                                className='fileImage'
                                style={{ display: 'none' }}
                            />
                            <label
                                className='input_seleccionarFile'
                                htmlFor='comprobantePago'
                            >Seleccionar: foto/captura de pantalla</label>
                            {previewImage && (
                                <div className='image_comprobante'>
                                    <img src={previewImage} alt='Comprobante' />
                                    <button
                                        type='button'
                                        className='remove-btn'
                                        onClick={removeImage}
                                    >x</button>
                                </div>
                            )}
                        </div>
                        <input
                            type="submit"
                            className='btnEnviar'
                        />
                    </form>

                </div>
            </div>
        </>
    )
}
