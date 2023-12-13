import { BufferGeometry, Float32BufferAttribute, PointsMaterial, AdditiveBlending, Color, TextureLoader } from 'three';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import React, { useMemo, useRef } from 'react';
import img from './assets/star1.png';
import './App.css';

extend({ OrbitControls });

const starColors = {
    O: '#5C7EFC',
    B: '#899EFC',
    A: '#C9D1FD',
    F: '#FFFFFF',
    G: '#FFF06E',
    K: '#F6AC5E',
    M: '#F07452'
};

const Stars = () => {
    let group = useRef();

    useFrame(() => {
        group.current.position.z += 0.035;
        //console.log(group.current.position.z);

        if (group.current.position.z > 500) {
            group.current.position.z = -300;
        }
    });

    const [geo, mat] = useMemo(() => {
        const geo = new BufferGeometry();
        const selectedColor =
            starColors[Object.keys(starColors)[Math.floor(Math.random() * Object.keys(starColors).length)]];
        const color = new Color(selectedColor);
        const loader = new TextureLoader();
        const texture = loader.load(img);
        const mat = new PointsMaterial({
            size: 5.5,
            sizeAttenuation: false,
            depthWrite: false,
            blending: AdditiveBlending,
            vertexColors: true,
            map: texture,
            transparent: true
        });
        const vertices = [];
        const colors = [];
        const coords = [...Array(10000)].map(() => [
            Math.random() * 800 - 400,
            Math.random() * 800 - 400,
            Math.random() * 800 - 400
        ]);
        coords.forEach((coord) => {
            vertices.push(coord[0], coord[1], coord[2]);
            const selectedColor =
                starColors[Object.keys(starColors)[Math.floor(Math.random() * Object.keys(starColors).length)]];
            const color = new Color(selectedColor);
            colors.push(color.r, color.g, color.b);
        });
        geo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
        return [geo, mat, vertices, coords, colors];
    }, []);
    return (
        <group ref={group}>
            <points geometry={geo} material={mat} />
        </group>
    );
};

const Scene = () => {
    return (
        <Canvas
            id="background-canvas"
            style={{ background: '#000', width: '100vw', height: '100vh' }}
            camera={{ position: [0, 0, 300], fov: 60 }}
            onCreated={({ gl }) => {
                gl.setSize(window.innerWidth, window.innerHeight);
            }}
        >
            <Stars />
            {/* <OrbitControls enableDamping dampingFactor={0.25} rotateSpeed={0.5} /> */}
            <EffectComposer>
                <Bloom intensity={1} luminanceThreshold={0} luminanceSmoothing={0.9} />
            </EffectComposer>
        </Canvas>
    );
};

export default Scene;
